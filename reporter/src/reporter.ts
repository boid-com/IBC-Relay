import {
  fetchAllRows,
  fetchHeadBlockNumbers,
  sendTransaction,
} from "./eos/fetch";
import { getContractsForNetwork } from "./eos/networks";
import { logger } from "./logger";
import {
  isNetworkName,
  NetworkName,
  TChannelRow,
  TReportsRow,
  TReportsRowTransformed,
  TTransfersRow,
  TTransfersRowTransformed,
} from "./types";
import {
  extractRpcError,
  formatBloksTransaction,
  pickRandom,
  sleep,
} from "./utils";
import { pulse } from "./utils/health";

export default class Reporter {
  network: NetworkName;
  channel: NetworkName;
  channels: TChannelRow[] = [];
  transfers: TTransfersRowTransformed[] = [];
  transferIrreversibilityMap: { [key: string]: number } = {};
  reports: TReportsRowTransformed[] = [];
  currentHeadBlock = Infinity;
  currentHeadTime = new Date().toISOString();
  currentIrreversibleHeadBlock = Infinity;

  constructor(networkName: NetworkName) {
    this.network = networkName;
  }

  log(level: string, ...args) {
    const [firstArg, ...otherArgs] = args;
    logger.log(level, `Reporter ${this.network}: ${firstArg}`, ...otherArgs);
  }

  public async start() {
    this.log(`info`, `started`);

    while (true) {
      try {
        await this.fetchChannels();

        for (const channel of this.channels) {
          if (Boolean(channel.enabled)) {
            this.channel = <NetworkName>channel.channel_name;

            try {
              await Promise.all([
                this.fetchTransfers(),
                this.fetchXReports(),
                this.fetchHeadBlockNumbers(),
              ]);

              this.printState();
              pulse(this.network, this.currentHeadBlock, this.currentHeadTime);

              await this.reportTransfers();
              await this.executeReports();

            } catch (error) {
              this.log(`error`, extractRpcError(error));
            }
          }
        }

      } catch (error) {
        this.log(`error`, extractRpcError(error));

      } finally {
        await sleep(10000);
      }
    }
  }

  async fetchChannels() {
    const contracts = getContractsForNetwork(this.network);

    this.channels = await fetchAllRows(this.network)<TChannelRow>({
      code: contracts.ibc,
      scope: contracts.ibc,
      table: `channels`
    });
  }

  async fetchTransfers() {
    const contracts = getContractsForNetwork(this.network);
    let transfers = await fetchAllRows(this.network)<TTransfersRow>({
      code: contracts.ibc,
      scope: this.channel,
      table: `transfers`,
      lower_bound: Math.floor(Date.now() / 1e3),
      index_position: `2`,
      key_type: `i64`,
    });

    this.transfers = transfers.map((t) => ({
      ...t,
      id: Number.parseInt(`${t.id}`, 10),
      is_refund: Boolean(t.is_refund),
      // do not overwrite original transaction_time and expires_at
      // if a Date object is serialized back using eosjs, it will _not_ equal
      // the original strings because of time zones
      // new Date(Date.parse(a + 'Z')) https://github.com/EOSIO/eosjs/blob/master/src/eosjs-serialize.ts#L540
      // they should do: new Date(Date.parse(a.toISOString()))
      transactionDate: new Date(`${t.transaction_time}Z`),
      expiresAtDate: new Date(`${t.expires_at}Z`),
    }));
  }

  async fetchXReports() {
    const xChainNetwork = this.channel;
    const xChainChannel = this.network;
    const contracts = getContractsForNetwork(xChainNetwork);
    const reports = await fetchAllRows(xChainNetwork)<TReportsRow>({
      code: contracts.ibc,
      scope: xChainChannel,
      table: `reports`,
      lower_bound: Math.floor(Date.now() / 1e3),
      index_position: `3`,
      key_type: `i64`,
    });
    this.reports = reports.map((r) => ({
      ...r,
      id: Number.parseInt(`${r.id}`, 10),
    }));
  }

  async fetchHeadBlockNumbers() {
    const {
      headBlockNumber,
      headBlockTime,
      lastIrreversibleBlockNumber,
    } = await fetchHeadBlockNumbers(this.network)();
    this.currentHeadBlock = headBlockNumber;
    this.currentIrreversibleHeadBlock = lastIrreversibleBlockNumber;
    this.currentHeadTime = headBlockTime;
  }

  private async reportTransfers() {
    const unreportedTransfers = this.transfers.filter((t) => {
      const isExpired = Date.now() > t.expiresAtDate.getTime();
      if (isExpired) return false;

      if (!isNetworkName(t.to_blockchain))
        throw new Error(
          `Unknwon blockchain in transfer with id ${t.id}: ${t.to_blockchain}`
        );
      const xcontracts = getContractsForNetwork(t.to_blockchain);

      const alreadyReported = this.reports.some((r) => {
        return (
          r.transfer.id === t.id &&
          r.transfer.from_blockchain === t.from_blockchain &&
          r.transfer.transaction_id === t.transaction_id &&
          r.confirmed_by.includes(xcontracts.reporterAccount)
        );
      });

      return !alreadyReported;
    });
    if (unreportedTransfers.length === 0) return;

    const irreversibleUnreportedTransfers = await this.filterTransfersByIrreversibility(
      unreportedTransfers
    );
    if (irreversibleUnreportedTransfers.length === 0) return;

    const transferToProcess = pickRandom(irreversibleUnreportedTransfers);

    const toBlockchain = transferToProcess.to_blockchain;
    if (!isNetworkName(toBlockchain))
      throw new Error(
        `Unknwon blockchain in transfer with id ${transferToProcess.id}: ${toBlockchain}`
      );

    const xcontracts = getContractsForNetwork(toBlockchain);
    try {
      const tx = await sendTransaction(toBlockchain)({
        account: xcontracts.ibc,
        name: `report`,
        authorization: [
          {
            actor: xcontracts.reporterAccount,
            permission: xcontracts.reporterPermission,
          },
        ],
        data: {
          reporter: xcontracts.reporterAccount,
          channel: this.network,
          transfer: transferToProcess,
        },
      });
      this.log(
        `info`,
        `Reported transfer with id ${this.getInternalUniqueTransferId(
          transferToProcess
        )}: ${formatBloksTransaction(toBlockchain, tx.transaction_id)}`
      );
    } catch (error) {
      // const errorMessage = extractRpcError(error)
      throw error;
    }
  }

  private async executeReports() {
    const reportsToExecute = this.reports.filter((r) => {
      const reporterName = getContractsForNetwork(
        r.transfer.to_blockchain as NetworkName
      ).reporterAccount;
      return (
        r.confirmed &&
        !r.executed &&
        !r.failed &&
        !r.failed_by.includes(reporterName)
      );
    });
    if (reportsToExecute.length === 0) return;

    const reportToExecute = pickRandom(reportsToExecute);
    const toBlockchain = reportToExecute.transfer.to_blockchain;
    if (!isNetworkName(toBlockchain))
      throw new Error(
        `Unknwon blockchain in reported transfer with id ${reportToExecute.id}: ${toBlockchain}`
      );

    const xcontracts = getContractsForNetwork(toBlockchain);
    let executionFailed = false;
    try {
      const tx = await sendTransaction(toBlockchain)({
        account: xcontracts.ibc,
        name: `exec`,
        authorization: [
          {
            actor: xcontracts.reporterAccount,
            permission: xcontracts.reporterPermission,
          },
        ],
        data: {
          reporter: xcontracts.reporterAccount,
          channel: this.network,
          report_id: reportToExecute.id,
        },
      });
      this.log(
        `info`,
        `Executed report-id ${reportToExecute.id
        } (transfer ${this.getInternalUniqueTransferId(
          reportToExecute.transfer as any
        )}): ${formatBloksTransaction(toBlockchain, tx.transaction_id)}`
      );
    } catch (error) {
      const errorMessage = extractRpcError(error);
      this.log(
        `error`,
        `Could not execute report-id ${reportToExecute.id
        } (transfer ${this.getInternalUniqueTransferId(
          reportToExecute.transfer as any
        )}): ${errorMessage}`
      );
      executionFailed = true;
    }

    if (!executionFailed) return;

    const tx = await sendTransaction(toBlockchain)({
      account: xcontracts.ibc,
      name: `execfailed`,
      authorization: [
        {
          actor: xcontracts.reporterAccount,
          permission: xcontracts.reporterPermission,
        },
      ],
      data: {
        reporter: xcontracts.reporterAccount,
        channel: this.network,
        report_id: reportToExecute.id,
      },
    });
    this.log(
      `info`,
      `Reported failed execution for ${reportToExecute.id
      }: ${formatBloksTransaction(toBlockchain, tx.transaction_id)}`
    );
  }

  private async filterTransfersByIrreversibility(
    transfers: TTransfersRowTransformed[]
  ): Promise<TTransfersRowTransformed[]> {
    // because rpc.history_get_transaction is deprecated, there's no way for us to get the exact block number of when the transaction was included
    // but when we see it in RAM, the current head block is definitely past it
    transfers.forEach((t) => {
      const tId = this.getInternalUniqueTransferId(t);
      if (!this.transferIrreversibilityMap[tId]) {
        const txInfo = `${t.from_account}@${t.from_blockchain} == ${t.quantity} ==> ${t.to_account}@${t.to_blockchain}`;
        this.log(
          `info`,
          `Saw new transfer ${tId} at block ${this.currentHeadBlock}\n${txInfo}\nWaiting for irreversibility`
        );
        // saw at headblock, wait until this block becomes irreversible
        this.transferIrreversibilityMap[tId] = this.currentHeadBlock;
      }
    });

    return transfers.filter(
      (t) =>
        this.currentIrreversibleHeadBlock >
        (this.transferIrreversibilityMap[this.getInternalUniqueTransferId(t)] ||
          Infinity)
    );
  }

  private getInternalUniqueTransferId(transfer: TTransfersRowTransformed) {
    return `${transfer.from_blockchain}|${transfer.id}|${transfer.transaction_id}`;
  }

  private printState() {
    //     this.log(`verbose`, `tranfers:`, this.transfers);
    //     this.log(`verbose`, `reports:`, this.reports);
    //     this.log(
    //       `verbose`,
    //       `headBlock: ${this.currentHeadBlock} irreversible: ${this.currentIrreversibleHeadBlock}`
    //     );
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./eos/fetch");
const networks_1 = require("./eos/networks");
const logger_1 = require("./logger");
const types_1 = require("./types");
const utils_1 = require("./utils");
const health_1 = require("./utils/health");
class Reporter {
    constructor(networkName) {
        this.channels = [];
        this.transfers = [];
        this.transferIrreversibilityMap = {};
        this.reports = [];
        this.currentHeadBlock = Infinity;
        this.currentHeadTime = new Date().toISOString();
        this.currentIrreversibleHeadBlock = Infinity;
        this.network = networkName;
    }
    log(level, ...args) {
        const [firstArg, ...otherArgs] = args;
        logger_1.logger.log(level, `Reporter ${this.network}: ${firstArg}`, ...otherArgs);
    }
    async start() {
        this.log(`info`, `started`);
        while (true) {
            try {
                await this.fetchChannels();
                for (const channel of this.channels) {
                    if (Boolean(channel.enabled)) {
                        this.channel = channel.channel_name;
                        try {
                            await Promise.all([
                                this.fetchTransfers(),
                                this.fetchXReports(),
                                this.fetchHeadBlockNumbers(),
                            ]);
                            this.printState();
                            health_1.pulse(this.network, this.currentHeadBlock, this.currentHeadTime);
                            await this.reportTransfers();
                            await this.executeReports();
                        }
                        catch (error) {
                            this.log(`error`, utils_1.extractRpcError(error));
                        }
                    }
                }
            }
            catch (error) {
                this.log(`error`, utils_1.extractRpcError(error));
            }
            finally {
                await utils_1.sleep(10000);
            }
        }
    }
    async fetchChannels() {
        const contracts = networks_1.getContractsForNetwork(this.network);
        this.channels = await fetch_1.fetchAllRows(this.network)({
            code: contracts.ibc,
            scope: contracts.ibc,
            table: `channels`
        });
    }
    async fetchTransfers() {
        const contracts = networks_1.getContractsForNetwork(this.network);
        let transfers = await fetch_1.fetchAllRows(this.network)({
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
        const contracts = networks_1.getContractsForNetwork(xChainNetwork);
        const reports = await fetch_1.fetchAllRows(xChainNetwork)({
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
        const { headBlockNumber, headBlockTime, lastIrreversibleBlockNumber, } = await fetch_1.fetchHeadBlockNumbers(this.network)();
        this.currentHeadBlock = headBlockNumber;
        this.currentIrreversibleHeadBlock = lastIrreversibleBlockNumber;
        this.currentHeadTime = headBlockTime;
    }
    async reportTransfers() {
        const unreportedTransfers = this.transfers.filter((t) => {
            const isExpired = Date.now() > t.expiresAtDate.getTime();
            if (isExpired)
                return false;
            if (!types_1.isNetworkName(t.to_blockchain))
                throw new Error(`Unknwon blockchain in transfer with id ${t.id}: ${t.to_blockchain}`);
            const xcontracts = networks_1.getContractsForNetwork(t.to_blockchain);
            const alreadyReported = this.reports.some((r) => {
                return (r.transfer.id === t.id &&
                    r.transfer.from_blockchain === t.from_blockchain &&
                    r.transfer.transaction_id === t.transaction_id &&
                    r.confirmed_by.includes(xcontracts.reporterAccount));
            });
            return !alreadyReported;
        });
        if (unreportedTransfers.length === 0)
            return;
        const irreversibleUnreportedTransfers = await this.filterTransfersByIrreversibility(unreportedTransfers);
        if (irreversibleUnreportedTransfers.length === 0)
            return;
        const transferToProcess = utils_1.pickRandom(irreversibleUnreportedTransfers);
        const toBlockchain = transferToProcess.to_blockchain;
        if (!types_1.isNetworkName(toBlockchain))
            throw new Error(`Unknwon blockchain in transfer with id ${transferToProcess.id}: ${toBlockchain}`);
        const xcontracts = networks_1.getContractsForNetwork(toBlockchain);
        try {
            const tx = await fetch_1.sendTransaction(toBlockchain)({
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
            this.log(`info`, `Reported transfer with id ${this.getInternalUniqueTransferId(transferToProcess)}: ${utils_1.formatBloksTransaction(toBlockchain, tx.transaction_id)}`);
        }
        catch (error) {
            // const errorMessage = extractRpcError(error)
            throw error;
        }
    }
    async executeReports() {
        const reportsToExecute = this.reports.filter((r) => {
            const reporterName = networks_1.getContractsForNetwork(r.transfer.to_blockchain).reporterAccount;
            return (r.confirmed &&
                !r.executed &&
                !r.failed &&
                !r.failed_by.includes(reporterName));
        });
        if (reportsToExecute.length === 0)
            return;
        const reportToExecute = utils_1.pickRandom(reportsToExecute);
        const toBlockchain = reportToExecute.transfer.to_blockchain;
        if (!types_1.isNetworkName(toBlockchain))
            throw new Error(`Unknwon blockchain in reported transfer with id ${reportToExecute.id}: ${toBlockchain}`);
        const xcontracts = networks_1.getContractsForNetwork(toBlockchain);
        let executionFailed = false;
        try {
            const tx = await fetch_1.sendTransaction(toBlockchain)({
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
            this.log(`info`, `Executed report-id ${reportToExecute.id} (transfer ${this.getInternalUniqueTransferId(reportToExecute.transfer)}): ${utils_1.formatBloksTransaction(toBlockchain, tx.transaction_id)}`);
        }
        catch (error) {
            const errorMessage = utils_1.extractRpcError(error);
            this.log(`error`, `Could not execute report-id ${reportToExecute.id} (transfer ${this.getInternalUniqueTransferId(reportToExecute.transfer)}): ${errorMessage}`);
            executionFailed = true;
        }
        if (!executionFailed)
            return;
        const tx = await fetch_1.sendTransaction(toBlockchain)({
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
        this.log(`info`, `Reported failed execution for ${reportToExecute.id}: ${utils_1.formatBloksTransaction(toBlockchain, tx.transaction_id)}`);
    }
    async filterTransfersByIrreversibility(transfers) {
        // because rpc.history_get_transaction is deprecated, there's no way for us to get the exact block number of when the transaction was included
        // but when we see it in RAM, the current head block is definitely past it
        transfers.forEach((t) => {
            const tId = this.getInternalUniqueTransferId(t);
            if (!this.transferIrreversibilityMap[tId]) {
                const txInfo = `${t.from_account}@${t.from_blockchain} == ${t.quantity} ==> ${t.to_account}@${t.to_blockchain}`;
                this.log(`info`, `Saw new transfer ${tId} at block ${this.currentHeadBlock}\n${txInfo}\nWaiting for irreversibility`);
                // saw at headblock, wait until this block becomes irreversible
                this.transferIrreversibilityMap[tId] = this.currentHeadBlock;
            }
        });
        return transfers.filter((t) => this.currentIrreversibleHeadBlock >
            (this.transferIrreversibilityMap[this.getInternalUniqueTransferId(t)] ||
                Infinity));
    }
    getInternalUniqueTransferId(transfer) {
        return `${transfer.from_blockchain}|${transfer.id}|${transfer.transaction_id}`;
    }
    printState() {
        //     this.log(`verbose`, `tranfers:`, this.transfers);
        //     this.log(`verbose`, `reports:`, this.reports);
        //     this.log(
        //       `verbose`,
        //       `headBlock: ${this.currentHeadBlock} irreversible: ${this.currentIrreversibleHeadBlock}`
        //     );
    }
}
exports.default = Reporter;
//# sourceMappingURL=reporter.js.map
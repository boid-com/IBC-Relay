import { Action } from "eosjs/dist/eosjs-serialize";
import { NetworkName } from "../types";
import { getApi } from "./api";
import { getRpc } from "./networks";
import { TTransactionResult } from "./types";
import { getEnvConfig } from "../dotenv";

// https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
type GetTableRowsOptions = {
  json?: boolean;
  code?: string;
  scope?: string;
  table?: string;
  lower_bound?: number | string;
  upper_bound?: number | string;
  limit?: number;
  key_type?: string;
  index_position?: string;
};

const MAX_PAGINATION_FETCHES = 20;

export const fetchRows = (network: NetworkName) => async <T>(
  options: GetTableRowsOptions
): Promise<T[]> => {
  const rpc = getRpc(network);
  const mergedOptions = {
    json: true,
    lower_bound: undefined,
    upper_bound: undefined,
    limit: 9999,
    ...options,
  };

  let lowerBound = mergedOptions.lower_bound;

  const result = await rpc.get_table_rows({
    ...mergedOptions,
    lower_bound: lowerBound,
  });

  return result.rows;
};

// work around the limit bug in nodeos due to max timeout
// https://github.com/EOSIO/eos/issues/3965
export const fetchAllRows = (network: NetworkName) => async <T>(
  options: GetTableRowsOptions,
  indexName = `id`
): Promise<T[]> => {
  const rpc = getRpc(network);
  const mergedOptions = {
    json: true,
    lower_bound: 0,
    upper_bound: undefined,
    limit: 9999,
    ...options,
  };

  let rows: T[] = [];
  let lowerBound = mergedOptions.lower_bound;

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < MAX_PAGINATION_FETCHES; i += 1) {
    const result = await rpc.get_table_rows({
      ...mergedOptions,
      lower_bound: lowerBound,
    });
    rows = rows.concat(result.rows);

    if (!result.more || result.rows.length === 0) break;

    // EOS 2.0 api
    if (typeof result.next_key !== `undefined`) {
      lowerBound = result.next_key;
    } else {
      lowerBound =
        Number.parseInt(
          `${result.rows[result.rows.length - 1][indexName]}`,
          10
        ) + 1;
    }
  }

  return rows;
};

type ScopeResult = {
  code: string;
  count: number;
  payer: string;
  scope: string;
  table: string;
};

export const fetchAllScopes = (network: NetworkName) => async (
  contract: string,
  table: string
): Promise<string[]> => {
  const rpc = getRpc(network);
  const mergedOptions = {
    json: true,
    lower_bound: undefined,
    upper_bound: undefined,
    limit: 9999,
    code: contract,
    table,
  };
  const rows = (await rpc.get_table_by_scope(mergedOptions))
    .rows as ScopeResult[];
  return rows.map((row) => row.scope);
};

export const fetchHeadBlockNumbers = (
  network: NetworkName
) => async () => {
  const rpc = getRpc(network);
  const response = await rpc.get_info();
  return {
    headBlockTime: response.head_block_time,
    headBlockNumber: response.head_block_num,
    lastIrreversibleBlockNumber: response.last_irreversible_block_num,
  };
};

export const sendTransaction = (network: NetworkName) => async (
  actions: Action | Action[]
): Promise<TTransactionResult> => {
  let _actions = Array.isArray(actions) ? actions : [actions];
  const txOptions = {
    broadcast: true,
    sign: true,
    blocksBehind: 3,
    expireSeconds: 60 * 5,
  };
  const eosApi = getApi(network);

  const config = getEnvConfig()[network]
  if (config.cpuPayer) {
    _actions.unshift({
      account: config.cpuPayer,
      name: `payforcpu`,
      authorization: [
        {
          actor: config.cpuPayer,
          permission: `payforcpu`,
        },
      ],
      data: {},
    });
  }

  return eosApi.transact(
    {
      actions: _actions,
    },
    txOptions
  );
};

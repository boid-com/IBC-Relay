"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = exports.fetchHeadBlockNumbers = exports.fetchAllScopes = exports.fetchAllRows = exports.fetchRows = void 0;
const api_1 = require("./api");
const networks_1 = require("./networks");
const dotenv_1 = require("../dotenv");
const MAX_PAGINATION_FETCHES = 20;
exports.fetchRows = (network) => async (options) => {
    const rpc = networks_1.getRpc(network);
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
exports.fetchAllRows = (network) => async (options, indexName = `id`) => {
    const rpc = networks_1.getRpc(network);
    const mergedOptions = {
        json: true,
        lower_bound: 0,
        upper_bound: undefined,
        limit: 9999,
        ...options,
    };
    let rows = [];
    let lowerBound = mergedOptions.lower_bound;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < MAX_PAGINATION_FETCHES; i += 1) {
        const result = await rpc.get_table_rows({
            ...mergedOptions,
            lower_bound: lowerBound,
        });
        rows = rows.concat(result.rows);
        if (!result.more || result.rows.length === 0)
            break;
        // EOS 2.0 api
        if (typeof result.next_key !== `undefined`) {
            lowerBound = result.next_key;
        }
        else {
            lowerBound =
                Number.parseInt(`${result.rows[result.rows.length - 1][indexName]}`, 10) + 1;
        }
    }
    return rows;
};
exports.fetchAllScopes = (network) => async (contract, table) => {
    const rpc = networks_1.getRpc(network);
    const mergedOptions = {
        json: true,
        lower_bound: undefined,
        upper_bound: undefined,
        limit: 9999,
        code: contract,
        table,
    };
    const rows = (await rpc.get_table_by_scope(mergedOptions))
        .rows;
    return rows.map((row) => row.scope);
};
exports.fetchHeadBlockNumbers = (network) => async () => {
    const rpc = networks_1.getRpc(network);
    const response = await rpc.get_info();
    return {
        headBlockTime: response.head_block_time,
        headBlockNumber: response.head_block_num,
        lastIrreversibleBlockNumber: response.last_irreversible_block_num,
    };
};
exports.sendTransaction = (network) => async (actions) => {
    let _actions = Array.isArray(actions) ? actions : [actions];
    const txOptions = {
        broadcast: true,
        sign: true,
        blocksBehind: 3,
        expireSeconds: 60 * 5,
    };
    const eosApi = api_1.getApi(network);
    const config = dotenv_1.getEnvConfig()[network];
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
    return eosApi.transact({
        actions: _actions,
    }, txOptions);
};
//# sourceMappingURL=fetch.js.map
import { JsonRpc } from "eosjs";
import fetch from "node-fetch";
import { NetworkName } from "../types";
import { getEnvConfig } from "../dotenv";
import { isProduction } from "../utils";

export const getContractsForNetwork = (network: NetworkName): {
  token: string;
  ibc: string;
  cpuPayer: string;
  reporterAccount: string;
  reporterPermission: string;
} => {
  const envConfig = getEnvConfig();
  if (isProduction()) {
    switch (network) {
      case `eos`:
        return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...((envConfig.eos || {}) as any) };
      case `telos`:
        return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...((envConfig.telos || {}) as any) };
      case `wax`:
        return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...((envConfig.wax || {}) as any) };
      default:
        throw new Error(`No contract accounts for "${network}" network defined yet`);
    }
  } else {
    switch (network) {
      case `eos`:
        return { ibc: `ibcbridgedev`, cpuPayer: null, ...((envConfig.eos || {}) as any) };
      case `telos`:
        return { ibc: `ibcbridgedev`, cpuPayer: null, ...((envConfig.telos || {}) as any) };
      case `wax`:
        return { ibc: `ibcbridgedev`, cpuPayer: null, ...((envConfig.wax || {}) as any) };
      default:
        throw new Error(`No contract accounts for "${network}" network defined yet`);
    }
  }
};

const createNetwork = (nodeEndpoint, chainId) => {
  const matches = /^(https?):\/\/(.+?)(:\d+){0,1}$/.exec(nodeEndpoint);
  if (!matches) {
    throw new Error(
      `Could not parse HTTP endpoint for chain ${chainId}. Needs protocol and port: "${nodeEndpoint}"`
    );
  }

  const [, httpProtocol, host, portMatch] = matches;
  const portString = portMatch
    ? portMatch.replace(/\D/gi, ``)
    : httpProtocol === `https`
      ? `443`
      : `80`;
  const port = Number.parseInt(portString, 10);

  return {
    chainId,
    protocol: httpProtocol,
    host,
    port,
    nodeEndpoint,
  };
};
/*
- Production networks
    - Telos mainnet : 4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11
    - EOS mainnet : aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906
    - Wax mainnet : 1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4
- Test networks
    - Telos testnet : 1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f
    - Jungle testnet : 2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840
    - Wax testnet : f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12
 */
const EosNetwork = createNetwork(process.env.EOS_ENDPOINT || "https://eos.eosn.io", "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906");
const TelosNetwork = createNetwork(process.env.TELOS_ENDPOINT || "https://telos.caleos.io", "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11");
const WaxNetwork = createNetwork(process.env.WAX_ENDPOINT || "https://wax.greymass.com", "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4");
const EosTestNetwork = createNetwork(process.env.EOSTEST_ENDPOINT || "https://jungle3.cryptolions.io:443", "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840");
const TelosTestNetwork = createNetwork(process.env.TELOSTEST_ENDPOINT || "https://testnet.telos.africa:443", "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f");
const WaxTestNetwork = createNetwork(process.env.WAXTEST_ENDPOINT || "https://testnet.waxsweden.org:443", "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12");

function getNetwork(networkName) {
  if (isProduction()) {
    switch (networkName) {
      case "eos":
        return EosNetwork;
      case "telos":
        return TelosNetwork;
      case "wax":
        return WaxNetwork;
      default:
        throw new Error("Network \"" + networkName + "\" not supported yet.");
    }
  } else {
    switch (networkName) {
      case "eos":
        return EosTestNetwork;
      case "telos":
        return TelosTestNetwork;
      case "wax":
        return WaxTestNetwork;
      default:
        throw new Error("Network \"" + networkName + "\" not supported yet.");
    }
  }
}

export const getRpc: (networkName: string) => JsonRpc = (() => {
  const rpcs = {};

  return (networkName: string) => {
    if (!rpcs[networkName]) {
      rpcs[networkName] = new JsonRpc(getNetwork(networkName).nodeEndpoint, {
        fetch: fetch,
      });
    }

    return rpcs[networkName];
  };
})();

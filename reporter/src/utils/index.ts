import { NetworkName } from "../types";
import { RpcError } from "eosjs";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isProduction = () => process.env.NODE_ENV === `production`;

export const formatBloksTransaction = (network: NetworkName, txId: string) => {
  let bloksSubdomain = `bloks.io`
  if (isProduction()) {
    switch (network) {
      case `eos`:
        bloksSubdomain = `bloks.io`;
        break;
      case `telos`:
        bloksSubdomain = `telos.bloks.io`;
        break;
      case `wax`:
        bloksSubdomain = `wax.bloks.io`;
        break;
    }
  } else {
    switch (network) {
      case `eos`:
        bloksSubdomain = `jungle3.bloks.io`;
        break;
      case `telos`:
        bloksSubdomain = `telos-test.bloks.io`;
        break;
      case `wax`:
        bloksSubdomain = `wax-test.bloks.io`;
        break;
    }
  }

  return `https://${bloksSubdomain}/transaction/${txId}`;
};

export const pickRandom = <T>(array: T[]):T => {
  if (!Array.isArray(array) || array.length === 0) return null;

  return array[Math.floor(Math.random() * array.length)];
};

export const extractRpcError = (err: Error|RpcError|any) => {
  let message = err.message
  if(err instanceof RpcError) {
    try {
      message = JSON.parse(err.message).error.details.map(detail => {
        return detail.message
      }).join(`\n`)
    } catch {}
  } else if (err.json) {
    // might only be LiquidAPps client lib
    if(err.json.error) return err.json.error;
  }
  return message
}

export const ALL_NETWORKS: NetworkName[] = [`eos`, `telos`, `wax`];

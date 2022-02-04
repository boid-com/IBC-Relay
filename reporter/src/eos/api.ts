import { Api } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "util";
import { getRpc } from "./networks";
import { getEnvConfig } from "../dotenv";

export const getApi: (networkName: string) => Api = (() => {
  const apis = {};

  return (networkName: string) => {
    if (!apis[networkName]) {
      const envConfig = getEnvConfig();
      if (!envConfig[networkName])
        throw new Error(`Environment variables not loaded for: ${networkName}`);

      const signatureProvider = new JsSignatureProvider([
        envConfig[networkName].reporterKey,
        envConfig[networkName].cpuKey,
      ].filter(Boolean));
      apis[networkName] = new Api({
        rpc: getRpc(networkName),
        signatureProvider,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder() as any,
      });
    }

    return apis[networkName];
  };
})();

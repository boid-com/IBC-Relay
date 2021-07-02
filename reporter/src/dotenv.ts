import * as dotenv from "dotenv";
import { ALL_NETWORKS } from "./utils";
import { NetworkName } from "./types";

const result = dotenv.config();

if (result.error) {
  console.log('error')
  throw result.error;
}

export const getEnvConfig = () => {
  const parse = (networkName: NetworkName) => {
    const VAR_NAME = `${networkName.toUpperCase()}_IBC`;
    const val = process.env[VAR_NAME];

    if (!val)
      return;

    const [acc, permission, key, cpuPayer, cpuKey] = val.split(`;`).map((x) => x.trim());
    return {
      reporterAccount: acc,
      reporterPermission: permission,
      reporterKey: key,
      cpuPayer,
      cpuKey,
    };
  };

  return ALL_NETWORKS.reduce(
    (acc, network) => ({
      ...acc,
      [network]: parse(network),
    }),
    {}
  ) as {
    [key: string]: {
      reporterAccount: string;
      reporterPermission: string;
      reporterKey: string;
      cpuPayer?: string;
      cpuKey?: string;
    };
  };
};

import * as dotenv from "dotenv";
import { ALL_NETWORKS, isProduction } from "./utils";
import { NetworkName } from "./types";

const result = dotenv.config();

if (result.error) {
  console.log('error')
  throw result.error;
}

export const getEnvConfig = () => {
  const parse = (networkName: NetworkName) => {
    const VAR_NAME = isProduction() ? `${networkName.toUpperCase()}_IBC` : `${networkName.toUpperCase()}TEST_IBC`;
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

// Move NETWORKS_TO_WATCH to alow it to be set in the .env file
export const getNetworksToWatch = () => {
  const val = process.env[`NETWORKS_TO_WATCH`];
  if (!val) {
    return ALL_NETWORKS
  } else {
    return (val.split(`,`).map((x) => x.trim() as NetworkName) || ALL_NETWORKS) as NetworkName[];
  }
}

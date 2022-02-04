export type IEOSNetwork = {
  chainId: string;
  nodeEndpoint: string;
  protocol: string;
  host: string;
  port: number;
};

// mimicks EOS C++ smart contract microseconds class
type microseconds = {
  _count: number | string;
};

// mimicks EOS C++ smart contract symbol class
export type TAssetSymbol = {
  code: string;
  precision: number;
};

// mimicks EOS C++ smart contract extended_symbol class
export type TExtendedSymbol = {
  symbol: TAssetSymbol;
  contract: string;
};

export type TAsset = {
  amount: number;
  symbol: TAssetSymbol;
};

export type NetworkName = `eos` | `telos` | `wax`;

export function isNetworkName(networkName: string): networkName is NetworkName {
  switch (networkName) {
    case `eos`:
      return true;
    case `telos`:
      return true;
    case `wax`:
      return true;
  }
  return false;
}

export type TChannelRow = {
  channel_name: string;
  remote_contract: string;
  next_transfer_id: number;
  enabled: number;
};

export type TAccountsRow = {
  balance: string;
};
export type TTransfersRow = {
  id: number|string; // 0;
  transaction_id: string; // "e33e97a9932485223a8a673e767127002d163b579ccba57366dde3d1175ad92a";
  from_blockchain: string; // "eos";
  to_blockchain: string; // "telos";
  from_account: string; // "ibc1eos1rep1";
  to_account: string; // "cmichelonwax";
  quantity: string; // "0.123456789 EOSDT";
  memo: string;
  transaction_time: string; // "2020-05-20T11:29:56";
  expires_at: string; // "2020-05-21T11:29:56";
  is_refund: number; // 0;
};

export type TTransfersRowTransformed = Omit<TTransfersRow, "id" | "is_refund"> & {
  id: number;
  is_refund: boolean;
  transactionDate: Date;
  expiresAtDate: Date;
};

export type TReportsRow = {
  id: number|string; // 0,
  transfer: TTransfersRow
  confirmed: number; // 0,
  confirmed_by: string[]; // [ 'ibc1wax1rep1' ],
  executed: number; // 0,
  failed: number; // 0,
  failed_by: string[]; // []
}
export type TReportsRowTransformed = Omit<TReportsRow, "id"> & {
  id: number;
};

export function exhaustiveCheck(x: never) {
  throw new Error("exhaustiveCheck: should not reach here");
}

export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

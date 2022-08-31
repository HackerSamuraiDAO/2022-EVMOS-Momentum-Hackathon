import config from "../../config.json";

export type LinkKey = keyof typeof config.links;
export type WalletKey = keyof typeof config.wallets;

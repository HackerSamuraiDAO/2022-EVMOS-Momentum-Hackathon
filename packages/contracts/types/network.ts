import networks from "../networks.json";

export type ChainId = keyof typeof networks;

export const isChainId = (chainId?: string | number): chainId is ChainId => {
  if (!chainId) {
    return false;
  }
  return Object.keys(networks).includes(String(chainId));
};

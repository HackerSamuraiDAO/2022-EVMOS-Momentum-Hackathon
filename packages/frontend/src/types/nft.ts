export interface NFT {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  metadata: {
    name?: string;
    image?: string;
  };
}

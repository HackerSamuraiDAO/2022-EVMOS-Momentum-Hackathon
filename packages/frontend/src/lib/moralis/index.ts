import Moralis from "moralis";

import { ChainId } from "../../../../contracts/types/network";
import { NFT } from "../../types/nft";

const apiKey = process.env.MORALIS_API_KEY;

export const initMorarils = async () => {
  await Moralis.start({
    apiKey,
  });
};

export const getNFTs = async (chainId: ChainId, address: string): Promise<NFT[]> => {
  await initMorarils();
  const chain = `0x${chainId}`;
  const options = { chain, address };
  const { result } = await Moralis.EvmApi.account.getNFTs(options);
  const nfts = result.map((nft) => {
    const { tokenAddress, tokenId, metadata } = nft.format();
    return {
      chainId,
      contractAddress: tokenAddress,
      tokenId: tokenId.toString(),
      metadata: metadata
        ? {
            name: typeof metadata.name === "string" ? metadata.name : "",
            image: typeof metadata.image === "string" ? metadata.image : "",
          }
        : {},
    };
  });
  return nfts;
};

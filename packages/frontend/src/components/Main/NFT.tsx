import { Box, Image, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import React from "react";

import { truncate } from "../../lib/utils";
import { NFT as NFTType } from "../../types/nft";

export interface NFTProps {
  nft: NFTType;
  onClick?: () => void;
}

export const NFT: React.FC<NFTProps> = ({ nft, onClick }) => {
  return (
    <LinkBox cursor={onClick ? "pointer" : ""}>
      <LinkOverlay onClick={onClick} position="relative">
        {nft.metadata.name && (
          <Box
            textAlign={"center"}
            position="absolute"
            bottom="2"
            left="2"
            py="1"
            px="2"
            backgroundColor="gray.400"
            rounded="lg"
            fontSize="2xl"
          >
            <Text fontSize="xs" noOfLines={1} color="white">
              {truncate(nft.metadata.name, 20)}
            </Text>
          </Box>
        )}
        <Box
          textAlign={"center"}
          position="absolute"
          top="2"
          right="2"
          py="1"
          px="2"
          backgroundColor="blue.400"
          rounded="2xl"
          fontSize="xs"
        >
          <Text fontSize="xs" noOfLines={1} color="white">
            # {truncate(nft.tokenId, 10, 10)}
          </Text>
        </Box>
        <Image
          shadow="base"
          rounded="2xl"
          src={nft.metadata.image}
          alt={nft.metadata.name}
          fallbackSrc="/img/utils/placeholder.png"
          fit="cover"
          mb="2"
        />
      </LinkOverlay>
    </LinkBox>
  );
};

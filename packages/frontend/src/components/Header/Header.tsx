import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Wallet } from "../Wallet";

export const Header: React.FC = () => {
  return (
    <Box p="4" as="header">
      <Flex justify="space-between">
        <Text fontWeight={"bold"} color={config.styles.text.color}>
          <Image src="/img/brands/logo.png" h={"8"} w={"8"} alt="logo" />
        </Text>
        <ConnectWalletWrapper>
          <Wallet />
        </ConnectWalletWrapper>
      </Flex>
    </Box>
  );
};

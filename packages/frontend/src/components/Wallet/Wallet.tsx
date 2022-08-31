import { Box, Button, Flex, IconButton, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { MdTravelExplore } from "react-icons/md";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import networks from "../../../../contracts/networks.json";
import { ChainId, isChainId } from "../../../../contracts/types/network";
import config from "../../../config.json";
import { getFromLocalStorageTxList, truncate } from "../../lib/utils";
import { Modal } from "../Modal";

export const Wallet: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingIndex, setLoadingIndex] = React.useState<undefined | number>();
  const [chainId, setChainId] = React.useState<undefined | ChainId>();
  const [txList, setTxList] = React.useState<{ [key: string]: string[] }>();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chain } = useNetwork();

  const openMyWalletModal = () => {
    if (!chain) {
      return;
    }
    const chainId = chain.id.toString();
    if (!isChainId(chainId)) {
      return;
    }
    const txList = getFromLocalStorageTxList(chainId);
    setChainId(chainId);
    setTxList(txList);
    onOpen();
  };

  const checkBridgeStatus = async (tx: string, i: number) => {
    if (!chainId) {
      return;
    }
    setIsLoading(true);
    setLoadingIndex(i);
    try {
      const { data } = await axios.get(`/api/relayer/status?chainId=${chainId}&hash=${tx}`);
      if (data.status === "no") {
        alert("not yet bridged.");
      } else {
        alert(`bridged at tx:${data.tx} at destination chain.`);
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
      setLoadingIndex(undefined);
    }
  };

  return (
    <Box>
      <Stack direction={"row"}>
        <Button
          width="full"
          rounded={config.styles.button.rounded}
          size={config.styles.button.size}
          fontSize={config.styles.button.fontSize}
          color={config.styles.text.color.primary}
          onClick={openMyWalletModal}
        >
          {truncate(address, 6, 6)}
        </Button>
        <IconButton
          aria-label="disconnect"
          icon={<HiOutlineLogout />}
          rounded={config.styles.button.rounded}
          size={config.styles.button.size}
          onClick={() => disconnect()}
        />
      </Stack>
      <Modal onClose={onClose} isOpen={isOpen} header="Tx status">
        <Box>
          {chainId && txList && txList[chainId] && txList[chainId].length > 0 ? (
            <Stack>
              {txList[chainId].map((tx, i) => {
                return (
                  <Flex key={`tx_${i}`} justify="space-between" align={"center"}>
                    <Link href={`${networks[chainId].explorer}/tx/${tx}`} target="_blank" color={"blue.400"}>
                      <Text fontSize={"xs"}>{truncate(tx, 24)}...</Text>
                    </Link>
                    <IconButton
                      isLoading={isLoading && loadingIndex === i}
                      disabled={isLoading}
                      variant="outline"
                      aria-label="destination chain link"
                      size="sm"
                      rounded="2xl"
                      icon={<MdTravelExplore />}
                      onClick={() => checkBridgeStatus(tx, i)}
                    />
                  </Flex>
                );
              })}
            </Stack>
          ) : (
            <Text fontSize={"xs"}>No bridge tx yet...</Text>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

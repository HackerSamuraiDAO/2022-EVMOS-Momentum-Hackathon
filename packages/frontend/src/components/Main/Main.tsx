import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";
import React from "react";
import { VscArrowSwap } from "react-icons/vsc";
// import { useReward } from "react-rewards";
import { erc721ABI, useAccount, useNetwork, useSigner } from "wagmi";

import Hashi721BridgeArtifact from "../../../../contracts/artifacts/contracts/Hashi721Bridge.sol/Hashi721Bridge.json";
import HashiFaucetERC721Artifact from "../../../../contracts/artifacts/contracts/HashiFaucetERC721.sol/HashiFaucetERC721.json";
import networks from "../../../../contracts/networks.json";
import { ChainId, isChainId } from "../../../../contracts/types/network";
import config from "../../../config.json";
import { addToLocalStorageTxList } from "../../lib/utils";
import { NFT as NFTType } from "../../types/nft";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Modal } from "../Modal";
import { NetworkSelectOptions } from "./NetworkSelectOptions";
import { NFT } from "./NFT";

const defaultConsoleText =
  "nfthashi is trustminimised crosschain bridge. We try to implement IBC bridge with Rinkeby -> EVMOS. connect wallet, then click select nft...";

export const Main: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sourceChainId, setSourceChainId] = React.useState<ChainId>("4");
  const [targetChainId, setTargetChainId] = React.useState<ChainId>("9000");
  const [nfts, setNFTs] = React.useState<NFTType[]>([]);
  const [selectedNFT, setSelectedNFT] = React.useState<NFTType>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [consoleMode, setConsoleMode] = React.useState<"normal" | "error">("normal");
  const [consoleText, setConsoleText] = React.useState([defaultConsoleText]);

  // const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward("confettiReward", "confetti");

  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const log = (...text: string[]) => {
    setConsoleMode("normal");
    setConsoleText(text);
  };
  const error = (...text: string[]) => {
    setConsoleMode("error");
    setConsoleText(text);
  };

  const closeModal = () => {
    log(defaultConsoleText);
    onClose();
  };

  const bridge = async () => {
    if (!selectedNFT || !address || !signer || !chain) {
      return;
    }
    setIsLoading(true);
    try {
      const sorceNetwork = networks[sourceChainId];
      const targetNetwork = networks[targetChainId];
      const connectedChainId = chain.id.toString();
      if (connectedChainId !== sourceChainId) {
        error("wrong network detected, please connect to", sorceNetwork.name.toLowerCase());
        return;
      }
      const nftContract = new ethers.Contract(selectedNFT.contractAddress, erc721ABI, signer);
      log("network is ok, checking approval...");
      const resolved = await Promise.all([
        nftContract.getApproved(selectedNFT.tokenId).catch(() => false),
        nftContract.isApprovedForAll(address, sorceNetwork.contracts.bridge).catch(() => false),
      ]);
      const approved = resolved.some((v) => v === true);
      const bridgeContractAddress = sorceNetwork.contracts.bridge;
      if (!approved) {
        log("not approved, confirm approve tx...");
        const tx = await nftContract.setApprovalForAll(bridgeContractAddress, true);
        log("approve tx sent. waiting for tx confirmation...");
        await tx.wait();
      }

      const bridge = new ethers.Contract(bridgeContractAddress, Hashi721BridgeArtifact.abi, signer);

      const { hash } = await bridge.xSend(
        selectedNFT.contractAddress,
        address,
        address,
        selectedNFT.tokenId,
        targetNetwork.domain,
        ""
      );
      clear();
      log(
        "bridge tx sent. it takes about 30-60m to complete cross-chain bridge, you can check status by clicking top-right wallet button. If you have feedback, please join discord at right bottom icon and talk to us."
      );
      addToLocalStorageTxList(chain.id.toString(), hash);
    } catch (e: any) {
      error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setConsoleText([defaultConsoleText]);
    setSelectedNFT(undefined);
  };

  // const swapChainId = () => {
  //   clear();
  //   setSourceChainId(targetChainId);
  //   setTargetChainId(sourceChainId);
  // };

  const mintNFTFromFaucet = async () => {
    if (!chain || !signer) {
      return;
    }
    const sorceNetwork = networks[sourceChainId];
    const connectedChainId = chain.id.toString();
    if (connectedChainId !== sourceChainId) {
      alert(`wrong network detected, please connect to ${sorceNetwork.name.toLowerCase()}`);
      return;
    }
    const faucet = new ethers.Contract(networks[sourceChainId].contracts.faucet, HashiFaucetERC721Artifact.abi, signer);
    await faucet.mint();
    alert(`mint tx sent. please wait for some time then reload page to select minted nft.`);
  };

  const openSelectNFTModal = async () => {
    if (!chain || !address) {
      return;
    }
    setIsLoading(true);
    try {
      const sorceNetwork = networks[sourceChainId];
      const connectedChainId = chain.id.toString();
      if (connectedChainId !== sourceChainId) {
        error("wrong network detected, please connect to", sorceNetwork.name.toLowerCase());
        return;
      }

      log("selected", `${networks[sourceChainId].name.toLowerCase()},`, "loading nft from moralis api...");
      const { data } = await axios.get(`/api/nfts?chainId=${sourceChainId}&address=${address}`);
      setNFTs(data);
      onOpen();
    } catch (e: any) {
      error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceChainIdChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = e.target.value;
    if (!isChainId(inputValue)) {
      return;
    }
    clear();
    if (inputValue === targetChainId) {
      setTargetChainId(sourceChainId);
    }
    setSourceChainId(inputValue);
  };

  const handleTargetChainIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = e.target.value;
    if (!isChainId(inputValue)) {
      return;
    }
    clear();
    if (inputValue === sourceChainId) {
      setSourceChainId(targetChainId);
    }
    setTargetChainId(inputValue);
  };

  const handleNFTSelected = async (index: number) => {
    setSelectedNFT(nfts[index]);
    closeModal();
    log("nft is selected. click bridge to proceed...");
  };

  React.useEffect(() => {
    clear();
  }, [address]);

  return (
    <Stack spacing="4">
      <Box shadow="base" borderRadius="2xl" p="4" backgroundColor={config.styles.background.color.main}>
        <span id="confettiReward" />
        <Stack spacing="4">
          <HStack justify={"space-between"} align="center" spacing="2">
            <VStack w="full">
              <Text fontSize="sm" fontWeight={"bold"} textAlign="center" color={config.styles.text.color.primary}>
                Source ChainId
              </Text>
              <Select
                variant={"filled"}
                onChange={handleSourceChainIdChange}
                value={sourceChainId}
                rounded={"2xl"}
                size="lg"
                fontSize={"sm"}
                disabled={true}
              >
                <NetworkSelectOptions />
              </Select>
            </VStack>
            <Box pt="8">
              <IconButton
                color="gray.800"
                // onClick={swapChainId}
                aria-label="swap"
                icon={<VscArrowSwap size="12px" />}
                background="white"
                rounded="full"
                size="xs"
                variant={"outline"}
                disabled={true}
              />
            </Box>
            <VStack w="full">
              <Text fontSize="sm" fontWeight={"bold"} textAlign="center" color={config.styles.text.color.primary}>
                Target ChainId
              </Text>
              <Select
                variant={"filled"}
                onChange={handleTargetChainIdChange}
                value={targetChainId}
                rounded={"2xl"}
                size="lg"
                fontSize={"sm"}
                disabled={true}
              >
                <NetworkSelectOptions />
              </Select>
            </VStack>
          </HStack>
          {selectedNFT && (
            <Flex justify={"center"} pt="4">
              <Box maxW="64">
                <NFT nft={selectedNFT} />
              </Box>
            </Flex>
          )}
          <ConnectWalletWrapper variant="outline">
            <HStack>
              {!selectedNFT ? (
                <Button
                  w="full"
                  variant="outline"
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  onClick={openSelectNFTModal}
                  isLoading={isLoading}
                  loadingText="Loading NFT"
                >
                  Select NFT
                </Button>
              ) : (
                <Button
                  w="full"
                  variant="outline"
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  onClick={bridge}
                  isLoading={isLoading}
                >
                  Bridge
                </Button>
              )}
            </HStack>
            <Modal isOpen={isOpen} onClose={closeModal} header="Select NFT">
              <Stack spacing="4">
                <Button fontSize="xs" color={"blue"} onClick={mintNFTFromFaucet}>
                  Mint Test NFT from Faucet
                </Button>
                <Text color={config.styles.text.color.primary} fontSize="xs">
                  * Bridged NFT takes long to appear by moralis
                </Text>
              </Stack>

              <Flex justify={"center"} mt="8">
                <SimpleGrid columns={2} gap={4}>
                  {nfts.map((nft, i) => {
                    return <NFT nft={nft} key={i} onClick={() => handleNFTSelected(i)} />;
                  })}
                </SimpleGrid>
              </Flex>
            </Modal>
          </ConnectWalletWrapper>
        </Stack>
      </Box>
      <Box shadow="base" borderRadius="md" p="4" minH="24" backgroundColor={"gray.800"} opacity="90%">
        <Text color="blue.400" fontSize="xs">
          {`NFTHashi > `}
          {consoleText.map((text, i) => {
            return (
              <Text
                key={`console-${i}`}
                color={consoleMode === "normal" ? "white" : "red.400"}
                fontSize="xs"
                as="span"
                m="0.5"
              >
                {text}
              </Text>
            );
          })}
        </Text>
      </Box>
    </Stack>
  );
};

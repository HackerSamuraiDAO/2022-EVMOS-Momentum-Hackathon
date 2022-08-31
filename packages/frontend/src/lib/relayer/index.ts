import { ethers } from "ethers";

import Hashi721Bridge from "../../../../contracts/artifacts/contracts/Hashi721Bridge.sol/Hashi721Bridge.json";
import HashiExecutor from "../../../../contracts/artifacts/contracts/HashiExecutor.sol/HashiExecutor.json";
import HashiHandler from "../../../../contracts/artifacts/contracts/HashiHandler.sol/HashiHandler.json";
import networks from "../../../../contracts/networks.json";
import { ChainId } from "../../../../contracts/types/network";

const blockNumberRange = 500;

/*
 * @dev currently relayer private key is managed by env
 *      I want to improve private key management security later
 */
const privateKey = process.env.RELAYER_PRIVATE_KEY || "";

/*
 * @dev get call and executed event in all chains
 */
const getEvents = async (chainId: ChainId, blockNumberRange: number) => {
  const network = networks[chainId];
  const provider = new ethers.providers.JsonRpcProvider(network.rpc);
  const handler = new ethers.Contract(network.contracts.handler, HashiHandler.abi, provider);
  const executor = new ethers.Contract(network.contracts.executor, HashiExecutor.abi, provider);
  const blockNumber = await provider.getBlockNumber();
  const handlerFilter = handler.filters.Called();
  const executorFilter = executor.filters.Executed();
  const from = blockNumber - blockNumberRange;
  const to = blockNumber;
  const promises = [handler.queryFilter(handlerFilter, from, to), executor.queryFilter(executorFilter, from, to)];
  const [handlerEvents, executorEvents] = await Promise.all(promises);
  return { chainId, handlerEvents, executorEvents };
};

export const run = async () => {
  /*
   * @dev need better block control for each chain later
   */
  const promises = Object.keys(networks).map((chainId) => {
    return getEvents(chainId as ChainId, blockNumberRange);
  });
  /*
   * @dev assuming only rinkeby and evmos are supported in this order
   *      Handling logic is needed when one more network is added
   */
  const [rinkebyEvents, evmosEvents] = await Promise.all(promises);

  /*
   * @dev Filtering processed events
   *      It is required to skip duplicated tx in destination chain
   *      I want to improve security later
   */
  const rinkebyProcessingEvents = rinkebyEvents.handlerEvents.filter((handlerEvent) => {
    return !evmosEvents.executorEvents.some((executorEvent) => {
      return handlerEvent.transactionHash === executorEvent.args?.hash;
    });
  });
  const evmosProcessingEvents = evmosEvents.handlerEvents.filter((handlerEvent) => {
    return !rinkebyEvents.executorEvents.some((executorEvent) => {
      return handlerEvent.transactionHash === executorEvent.args?.hash;
    });
  });

  const hashi721Interface = new ethers.utils.Interface(Hashi721Bridge.abi);

  /*
   * @dev Filtering invalid ipfs hash in relayer side
   *      It is required to make ipfs as multichain storage layer in our NFTHashi
   *      I want to improve validation schema and algorism for better performance later
   */
  const validatedRinkebyProcessingEvent = [];
  for (const rinkebyProcessingEvent of rinkebyProcessingEvents) {
    validatedRinkebyProcessingEvent.push(rinkebyProcessingEvent);
  }
  const validatedevmosProcessingEvent = [];
  for (const evmosProcessingEvent of evmosProcessingEvents) {
    // add validate here
    validatedevmosProcessingEvent.push(evmosProcessingEvent);
  }
  /*
   * @dev Sending Tx by Executor in destinattion chain
   *      It is to mint bridged NFT in destination chain
   *      I want to improve performance by multicall or merkle tree based validation in cotract side
   */
  const rinkebyNetwork = networks["4"];
  const evmosNetwork = networks["9000"];
  const rinkebyProvider = new ethers.providers.JsonRpcProvider(rinkebyNetwork.rpc);
  const evmosProvider = new ethers.providers.JsonRpcProvider(evmosNetwork.rpc);
  const rinkebySigner = new ethers.Wallet(privateKey, rinkebyProvider);
  const evmosSigner = new ethers.Wallet(privateKey, evmosProvider);
  const rinkebyExecutor = new ethers.Contract(rinkebyNetwork.contracts.executor, HashiExecutor.abi, rinkebySigner);
  const evmosExecutor = new ethers.Contract(evmosNetwork.contracts.executor, HashiExecutor.abi, evmosSigner);

  const tx = [];
  for (const processingEvent of validatedRinkebyProcessingEvent) {
    const result = await evmosExecutor.execute(
      processingEvent.transactionHash,
      rinkebyNetwork.domain,
      rinkebyNetwork.contracts.bridge,
      evmosNetwork.contracts.bridge,
      processingEvent.args?.callData
    );
    tx.push(result);
  }
  for (const processingEvent of validatedevmosProcessingEvent) {
    const result = await rinkebyExecutor.execute(
      processingEvent.transactionHash,
      rinkebyNetwork.domain,
      rinkebyNetwork.contracts.bridge,
      evmosNetwork.contracts.bridge,
      processingEvent.args?.callData
    );
    tx.push(result);
  }

  /*
   * @dev Return tx list for reference
   */
  return tx;
};

export const status = async (chainId: ChainId, hash: string) => {
  const destinationChainId = chainId === "4" ? "9000" : "4";
  const destinationNetwork = networks[destinationChainId];
  const provider = new ethers.providers.JsonRpcProvider(networks[destinationChainId].rpc);
  const executor = new ethers.Contract(destinationNetwork.contracts.executor, HashiExecutor.abi, provider);
  const blockNumber = await provider.getBlockNumber();
  const executorFilter = executor.filters.Executed(hash);
  const events = await executor.queryFilter(executorFilter, 0, blockNumber);
  if (events.length === 0) {
    return {
      tx: "",
      status: "no",
    };
  } else {
    return {
      tx: events[0].transactionHash,
      status: "yes",
    };
  }
};

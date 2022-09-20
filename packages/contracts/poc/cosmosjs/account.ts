import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient } from "@cosmjs/stargate";
import { evmosToEth } from "@tharsis/address-converter";
import { ethers } from "ethers";

import {
  EVM_RPC_EVMOS_TESTNET,
  EVMOS_PREFIX,
  JUNO_PREFIX,
  MNEMONIC,
  OSMOSIS_PREFIX,
  TENDERMINT_RPC_EVMOS,
  TENDERMINT_RPC_JUNO,
  TENDERMINT_RPC_OSMOSIS,
  TENDERMINT_RPC_THETA,
  THETA_PREFIX,
} from "./lib/constant";

async function main() {
  const thetaClient = await StargateClient.connect(TENDERMINT_RPC_THETA);

  console.log("menemonic:", MNEMONIC);
  const cosmosWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: THETA_PREFIX });

  const [cosmosAccount] = await cosmosWallet.getAccounts();
  console.log("cosmosAccount:", cosmosAccount.address);
  console.log("cosmosAccount balance:", await thetaClient.getAllBalances(cosmosAccount.address));

  const osmosisWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: OSMOSIS_PREFIX });
  const osmosisClient = await StargateClient.connect(TENDERMINT_RPC_OSMOSIS);

  const [osmosisAccount] = await osmosisWallet.getAccounts();
  console.log("osmosisAccount:", osmosisAccount.address);
  console.log("osmosisAccount balance:", await osmosisClient.getAllBalances(osmosisAccount.address));

  const junoWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: JUNO_PREFIX });
  const junoClient = await StargateClient.connect(TENDERMINT_RPC_JUNO);

  const [junoAccount] = await junoWallet.getAccounts();
  console.log("junoAccount:", junoAccount.address);
  console.log("junoAccount balance:", await junoClient.getAllBalances(junoAccount.address));

  const evmosClient = await StargateClient.connect(TENDERMINT_RPC_EVMOS);
  const evmosWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: EVMOS_PREFIX });

  const [evmosAccount] = await evmosWallet.getAccounts();
  console.log("evmAccount:", evmosAccount.address);
  console.log("evmAccount balance:", await evmosClient.getAllBalances(evmosAccount.address));

  const provider = new ethers.providers.JsonRpcProvider(EVM_RPC_EVMOS_TESTNET);
  const evmAddress = evmosToEth(evmosAccount.address);
  console.log("evmAccount evm address by evmosToEth:", evmAddress);
  console.log("evmAccount evm address balance:", await provider.getBalance(evmAddress));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

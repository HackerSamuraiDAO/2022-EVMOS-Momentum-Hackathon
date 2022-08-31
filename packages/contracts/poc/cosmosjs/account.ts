import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient } from "@cosmjs/stargate";
import { evmosToEth } from "@tharsis/address-converter";
import { ethers } from "ethers";

import { EVM_RPC_EVMOS, MNEMONIC, TENDERMINT_RPC_EVMOS, TENDERMINT_RPC_THETA } from "./lib/constant";

async function main() {
  const thetaClient = await StargateClient.connect(TENDERMINT_RPC_THETA);

  console.log("menemonic:", MNEMONIC);
  const cosmosWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: "cosmos" });

  const [cosmosAccount] = await cosmosWallet.getAccounts();
  console.log("cosmosAccount:", cosmosAccount.address);
  console.log("cosmosAccount balance:", await thetaClient.getAllBalances(cosmosAccount.address));

  const evmosClient = await StargateClient.connect(TENDERMINT_RPC_EVMOS);
  const evmosWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: "evmos" });

  const [evmosAccount] = await evmosWallet.getAccounts();
  console.log("evmAccount:", evmosAccount.address);
  console.log("evmAccount balance:", await evmosClient.getAllBalances(evmosAccount.address));

  const provider = new ethers.providers.JsonRpcProvider(EVM_RPC_EVMOS);
  const evmAddress = evmosToEth(evmosAccount.address);
  console.log("evmAccount evm address by evmosToEth:", evmAddress);
  console.log("evmAccount evm address balance:", await provider.getBalance(evmAddress));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

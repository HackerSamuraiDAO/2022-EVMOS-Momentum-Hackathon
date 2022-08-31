import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ethers } from "ethers";

import {
  ALICE_ADDRESS_THETA,
  EVM_RPC_EVMOS,
  FAUCET_ADDRESS_EVMOS,
  FAUCET_ADDRESS_EVMOS_EVM,
  FAUCET_ADDRESS_THETA,
  GAS_FEE_THETA,
  GAS_LIMIT_THETA,
  METAMASK_ADDRESS,
  METAMASK_ADDRESS_EVMOS,
  METAMASK_PRIVATE_KEY,
  MNEMONIC,
  TENDERMINT_RPC_EVMOS,
  TENDERMINT_RPC_THETA,
  THETA_PREFIX,
  THETA_TOKEN,
} from "./lib/constant";

async function main() {
  const evmosClient = await StargateClient.connect(TENDERMINT_RPC_EVMOS);

  const thetaAliceSigner = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: THETA_PREFIX,
  });
  console.log("Alice Signer", thetaAliceSigner);
  const signingClient = await SigningStargateClient.connectWithSigner(TENDERMINT_RPC_THETA, thetaAliceSigner);

  console.log("Alice balance before:", await thetaClient.getAllBalances(ALICE_ADDRESS_THETA));
  console.log("Faucet balance before:", await thetaClient.getAllBalances(FAUCET_ADDRESS_THETA));
  const thetaResult = await signingClient.sendTokens(
    ALICE_ADDRESS_THETA,
    FAUCET_ADDRESS_THETA,
    [{ denom: THETA_TOKEN, amount: "1" }],
    {
      amount: [{ denom: THETA_TOKEN, amount: GAS_FEE_THETA }],
      gas: GAS_LIMIT_THETA,
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

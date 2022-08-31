import { StargateClient } from "@cosmjs/stargate";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { FAUCET_TX_HASH_EVMOS, FAUCET_TX_HASH_THETA, TENDERMINT_RPC_EVMOS, TENDERMINT_RPC_THETA } from "./lib/constant";

async function main() {
  console.log("processing theta...");

  const thetaClient = await StargateClient.connect(TENDERMINT_RPC_THETA);
  console.log("With client, chain id:", await thetaClient.getChainId(), ", height:", await thetaClient.getHeight());

  const thetaFaucetTx = await thetaClient.getTx(FAUCET_TX_HASH_THETA);
  console.log("Faucet Tx:", thetaFaucetTx);

  if (thetaFaucetTx) {
    const decodedTx = Tx.decode(thetaFaucetTx.tx);
    console.log("DecodedTx:", decodedTx);
    if (decodedTx.body) {
      console.log("Decoded messages:", decodedTx.body.messages);
      const sendMessage = MsgSend.decode(decodedTx.body.messages[0].value);
      console.log("Sent message:", sendMessage);
    }
    if (decodedTx.authInfo && decodedTx.authInfo.fee) {
      console.log("Gas fee:", decodedTx.authInfo.fee.amount);
      console.log("Gas limit:", decodedTx.authInfo.fee.gasLimit.toString(10));
    }
  }

  console.log("processing evmos...");

  const evmosClient = await StargateClient.connect(TENDERMINT_RPC_EVMOS);
  console.log("With client, chain id:", await evmosClient.getChainId(), ", height:", await evmosClient.getHeight());

  const evmosFaucetTx = await evmosClient.getTx(FAUCET_TX_HASH_EVMOS);
  console.log("Faucet Tx:", evmosFaucetTx);

  if (evmosFaucetTx) {
    const decodedTx = Tx.decode(evmosFaucetTx.tx);
    console.log("DecodedTx:", decodedTx);
    if (decodedTx.body) {
      console.log("Decoded messages:", decodedTx.body.messages);
      const sendMessage = MsgSend.decode(decodedTx.body.messages[0].value);
      console.log("Sent message:", sendMessage);
    }
    if (decodedTx.authInfo && decodedTx.authInfo.fee) {
      console.log("Gas fee:", decodedTx.authInfo.fee.amount);
      console.log("Gas limit:", decodedTx.authInfo.fee.gasLimit.toString(10));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

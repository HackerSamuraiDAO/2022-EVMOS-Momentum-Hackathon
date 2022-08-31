import { StargateClient } from "@cosmjs/stargate";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { FAUCET_TX_HASH } from "./lib/constant";

async function main() {
  const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657";
  const client = await StargateClient.connect(rpc);
  console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());

  const faucetTx = await client.getTx(FAUCET_TX_HASH);
  console.log("Faucet Tx:", faucetTx);

  if (faucetTx) {
    const decodedTx = Tx.decode(faucetTx.tx);
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

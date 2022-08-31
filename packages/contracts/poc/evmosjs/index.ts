import { Wallet } from "@ethersproject/wallet";
import { broadcast, getSender, signTransaction, TESTNET_CHAIN, TESTNET_FEE } from "@hanchon/evmos-ts-wallet";
import { createMessageSend } from "@tharsis/transactions";

import { MNEMONIC, REST_RPC_EVMOS } from "../cosmosjs/lib/constant";

async function prepareMessage(wallet: Wallet) {
  console.log("test", wallet);
  const sender = await getSender(wallet, REST_RPC_EVMOS);
  console.log(sender);
  const txSimple = createMessageSend(TESTNET_CHAIN, sender, TESTNET_FEE, "", {
    destinationAddress: "evmos1pmk2r32ssqwps42y3c9d4clqlca403yd9wymgr",
    amount: "1",
    denom: "aevmos",
  });
  console.log("2");
  return { sender, txSimple };
}

(async () => {
  const privateMnemonic = MNEMONIC;
  const wallet = Wallet.fromMnemonic(privateMnemonic);
  const msgKeplr = await prepareMessage(wallet);
  console.log("3");
  const resKeplr = await signTransaction(wallet, msgKeplr.txSimple);
  const broadcastRes = await broadcast(resKeplr, REST_RPC_EVMOS);

  if (broadcastRes.tx_response.code === 0) {
    console.log("Success sign transaction");
  } else {
    console.log(`Error payload signature: ${broadcastRes}`);
  }
})();

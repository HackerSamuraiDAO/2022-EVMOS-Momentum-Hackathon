import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";

import { FAUCET_ADDRESS, MNEMONIC } from "./lib/constant";

async function main() {
  const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657";
  const client = await StargateClient.connect(rpc);
  console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());

  const aliceSigner = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: "cosmos",
  });

  console.log("Alice Signer", aliceSigner);

  const [aliceAccount] = await aliceSigner.getAccounts();
  const alice = aliceAccount.address;
  console.log("Alice's address from signer", alice);

  const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner);

  console.log(
    "With signing client, chain id:",
    await signingClient.getChainId(),
    ", height:",
    await signingClient.getHeight()
  );

  console.log("Alice balance before:", await client.getAllBalances(alice));
  console.log("Faucet balance before:", await client.getAllBalances(FAUCET_ADDRESS));

  const result = await signingClient.sendTokens(alice, FAUCET_ADDRESS, [{ denom: "uatom", amount: "1" }], {
    amount: [{ denom: "uatom", amount: "500" }],
    gas: "200000",
  });

  console.log("Transfer result:", result);

  console.log("Alice balance after:", await client.getAllBalances(alice));
  console.log("Faucet balance after:", await client.getAllBalances(FAUCET_ADDRESS));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

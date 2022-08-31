import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

import { MNEMONIC } from "./lib/constant";

async function main() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
  console.log("menemonic:", MNEMONIC);
  const [account] = await wallet.getAccounts();
  console.log("account:", account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

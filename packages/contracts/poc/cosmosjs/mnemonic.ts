import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function main() {
  const wallet = await DirectSecp256k1HdWallet.generate(12);
  const mnemonic = wallet.mnemonic;
  console.log("menemonic:", mnemonic);
  const [account] = await wallet.getAccounts();
  console.log("account:", account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

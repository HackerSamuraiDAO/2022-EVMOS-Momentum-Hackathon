import { task } from "hardhat/config";

import networks from "../networks.json";
import { isChainId } from "../types/network";

const ignore = ["faucet"];

task("verify", "verify").setAction(async (_, { network, run }) => {
  const { config } = network;
  const chainId = config.chainId?.toString();
  if (!isChainId(chainId)) {
    console.log("network invalid");
    return;
  }
  const { contracts } = networks[chainId];
  const promises = Object.entries(contracts)
    .filter(([name]) => !ignore.includes(name))
    .map(([name, address]) => {
      return run("verify:verify", {
        address,
        constructorArguments: [],
      }).catch((e) => {
        console.log(name, e.message);
      });
    });
  await Promise.all(promises);
  console.log("DONE");
});

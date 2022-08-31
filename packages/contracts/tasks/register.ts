import { task } from "hardhat/config";

import networks from "../networks.json";
import { isChainId } from "../types/network";

task("register", "integration register").setAction(async (_, { network, run }) => {
  const { config } = network;
  const chainId = config.chainId?.toString();
  if (!isChainId(chainId)) {
    console.log("network invalid");
    return;
  }
  const { contracts } = networks[chainId];
  const { bridge: selfContractAddress } = contracts;
  if (!selfContractAddress) {
    console.log("bridge not deployed");
    return;
  }
  for (const [key, value] of Object.entries(networks)) {
    if (key !== chainId) {
      const { domain: opponentDomainNum, contracts } = value;
      const { bridge: opponentContractAddress } = contracts;
      const opponentDomain = opponentDomainNum.toString();
      await run("sub-bridge-register", { selfContractAddress, opponentDomain, opponentContractAddress }).catch((e) =>
        console.log(e.message)
      );
    }
  }
  console.log("DONE");
});

import fs from "fs";
import { task } from "hardhat/config";
import path from "path";

import networks from "../networks.json";
import { isChainId } from "../types/network";

task("deploy", "deploy").setAction(async (_, { network, run, ethers }) => {

  const [signer] = await ethers.getSigners()
  console.log(signer.address)

  const { config } = network;
  const chainId = config.chainId?.toString();
  if (!isChainId(chainId)) {
    console.log("network invalid");
    return;
  }

  
  const { domain } = networks[chainId];
  const selfDomain = domain.toString();
  const wrapped721 = await run("sub-wrapped-721-deploy");
  const executor = await run("sub-executor-deploy");
  const handler = await run("sub-handler-deploy", { executor });
  const bridge = await run("sub-bridge-deploy", {
    selfDomain,
    handler,
    wrapped721,
  });
  networks[chainId].contracts.wrapped721 = wrapped721;
  networks[chainId].contracts.executor = executor;
  networks[chainId].contracts.handler = handler;
  networks[chainId].contracts.bridge = bridge;
  fs.writeFileSync(path.join(__dirname, "../networks.json"), JSON.stringify(networks));
  console.log("DONE");
});

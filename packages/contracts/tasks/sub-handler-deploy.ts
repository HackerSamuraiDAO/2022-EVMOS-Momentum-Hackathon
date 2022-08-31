import { task } from "hardhat/config";

task("sub-handler-deploy", "deploy handler")
  .addParam("executor", "executor")
  .setAction(async ({ executor }, { ethers }) => {
    const name = "HashiHandler";
    const HashiHandler = await ethers.getContractFactory(name);
    const hashiHandler = await HashiHandler.deploy();
    await hashiHandler.deployed();
    await hashiHandler.initialize(executor);
    console.log(name, "deployed to:", hashiHandler.address);
    return hashiHandler.address;
  });

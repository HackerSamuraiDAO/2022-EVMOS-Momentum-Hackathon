import { task } from "hardhat/config";

task("sub-executor-deploy", "deploy executor").setAction(async (_, { ethers }) => {
  const name = "HashiExecutor";
  const HashiExecutor = await ethers.getContractFactory(name);
  const hashiExecutor = await HashiExecutor.deploy();
  await hashiExecutor.deployed();
  await hashiExecutor.initialize();
  console.log(name, "deployed to:", hashiExecutor.address);
  return hashiExecutor.address;
});

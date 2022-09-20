import { task } from "hardhat/config";

task("sub-executor-deploy", "deploy executor").setAction(async (_, { ethers }) => {
  const name = "HashiExecutor";
  const HashiExecutor = await ethers.getContractFactory(name);
  const hashiExecutor = await HashiExecutor.deploy();
  await hashiExecutor.deployed();
  const tx = await hashiExecutor.initialize();
  await tx.wait();
  console.log(name, "deployed to:", hashiExecutor.address);
  return hashiExecutor.address;
});

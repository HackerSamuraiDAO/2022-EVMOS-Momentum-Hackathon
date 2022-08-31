import { task } from "hardhat/config";

task("sub-wrapped-721-deploy", "deploy wrapped 721").setAction(async (_, { ethers }) => {
  const name = "HashiWrapped721";
  const HashiWrapped721 = await ethers.getContractFactory(name);
  const hashiWrapped721 = await HashiWrapped721.deploy();
  await hashiWrapped721.deployed();
  console.log(name, "deployed to:", hashiWrapped721.address);
  return hashiWrapped721.address;
});

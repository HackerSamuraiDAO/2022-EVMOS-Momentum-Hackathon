import { task } from "hardhat/config";

task("sub-bridge-deploy", "deploy bridge")
  .addParam("selfDomain", "self domain")
  .addParam("handler", "handler")
  .addParam("wrapped721", "nft implementation")
  .setAction(async ({ selfDomain, handler, wrapped721 }, { ethers }) => {
    const name = "Hashi721Bridge";
    const Hashi721Bridge = await ethers.getContractFactory(name);
    const hashi721Bridge = await Hashi721Bridge.deploy();
    await hashi721Bridge.deployed();
    await hashi721Bridge.initialize(selfDomain, handler, wrapped721);
    console.log(name, "deployed to:", hashi721Bridge.address);
    return hashi721Bridge.address;
  });

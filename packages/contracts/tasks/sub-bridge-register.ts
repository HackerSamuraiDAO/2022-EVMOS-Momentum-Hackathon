import { task } from "hardhat/config";

task("sub-bridge-register", "register bridge")
  .addParam("selfContractAddress", "self contract address")
  .addParam("opponentDomain", "opponent domain")
  .addParam("opponentContractAddress", "opponent contract address")
  .setAction(async ({ selfContractAddress, opponentDomain, opponentContractAddress }, { ethers }) => {
    const name = "Hashi721Bridge";
    const Hashi721Bridge = await ethers.getContractFactory(name);
    const hashi721Bridge = await Hashi721Bridge.attach(selfContractAddress);
    const { hash, wait } = await hashi721Bridge.setBridgeContract(opponentDomain, opponentContractAddress);
    await wait()
    console.log(name, "registered", opponentDomain, opponentContractAddress, "at:", hash);
    return hash;
  });

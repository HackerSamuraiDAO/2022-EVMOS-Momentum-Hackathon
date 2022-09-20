import { task } from "hardhat/config";

task("sub-faucet-deploy", "deploy faucet")
  .setAction(async (_, { ethers }) => {
    const name = "HashiFaucetERC721";
    const HashiFaucetERC721 = await ethers.getContractFactory(name);
    const hashiFaucetERC721 = await HashiFaucetERC721.deploy();
    await hashiFaucetERC721.deployed();
    for(let i=0; i< 3; i++){
      const tx = await hashiFaucetERC721.mint();
      await tx.wait()
    }
    console.log(name, "deployed to:", hashiFaucetERC721.address);
    return hashiFaucetERC721.address;
  });

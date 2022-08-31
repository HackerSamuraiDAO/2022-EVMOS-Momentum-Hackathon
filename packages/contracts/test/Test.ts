import { ethers } from "hardhat";

describe("Precompiles", function () {
  const fixture = async () => {
    const [owner, otherAccount, malciousAccount] = await ethers.getSigners();

    const HashiFaucetERC721 = await ethers.getContractFactory("HashiFaucetERC721");
    const hashiFaucetERC721 = await HashiFaucetERC721.deploy();

    return { hashiFaucetERC721, owner, otherAccount, malciousAccount };
  };

  it("Should be working", async function () {
    const { hashiFaucetERC721 } = await fixture();
    console.log("hashiFaucetERC721", hashiFaucetERC721.address);
    await hashiFaucetERC721.mint();
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";

describe("Precompiles", function () {
  const fixture = async () => {
    const [owner, otherAccount, malciousAccount] = await ethers.getSigners();

    const Precompiles = await ethers.getContractFactory("Precompiles");
    const precompiles = await Precompiles.deploy();

    return { precompiles, owner, otherAccount, malciousAccount };
  };

  describe("Deployment", function () {
    it("Should be deployed with constructor params", async function () {
      const { precompiles } = await fixture();
      expect(precompiles.address).to.not.equal("");
    });
  });

  describe("Test01", function () {
    it("Should be working", async function () {
      const { precompiles } = await fixture();
      await precompiles.test01();
    });
  });
});

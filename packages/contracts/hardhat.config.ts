import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    chain01: {
      url: "http://localhost:8545",
    },
  },
};

export default config;

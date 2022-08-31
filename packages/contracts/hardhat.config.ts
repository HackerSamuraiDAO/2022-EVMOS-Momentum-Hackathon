import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

import { EVM_RPC_EVMOS, METAMASK_PRIVATE_KEY } from "./poc/cosmosjs/lib/constant";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    evmos: {
      url: EVM_RPC_EVMOS,
      accounts: [METAMASK_PRIVATE_KEY],
    },
  },
};

export default config;

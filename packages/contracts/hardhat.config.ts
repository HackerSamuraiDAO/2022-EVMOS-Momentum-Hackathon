import "@nomicfoundation/hardhat-toolbox";
import "./tasks/deploy";
import "./tasks/register";
import "./tasks/sub-bridge-deploy";
import "./tasks/sub-bridge-register";
import "./tasks/sub-executor-deploy";
import "./tasks/sub-handler-deploy";
import "./tasks/sub-wrapped-721-deploy";
import "./tasks/verify";

import { HardhatUserConfig } from "hardhat/config";

import networks from "./networks.json";
import { EVM_RPC_EVMOS, METAMASK_PRIVATE_KEY } from "./poc/cosmosjs/lib/constant";

const accounts = [METAMASK_PRIVATE_KEY];

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    rinkeby: {
      chainId: 4,
      url: networks["4"].rpc,
      accounts,
    },
    evmos: {
      url: EVM_RPC_EVMOS,
      accounts,
      chainId: 9000,
    },
  },
};

export default config;

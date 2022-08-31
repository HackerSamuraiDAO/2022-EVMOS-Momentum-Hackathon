import { IbcClient, Link } from "@confio/relayer/build";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { ethers } from "ethers";

import {
  EVMOS_PREFIX,
  EVMOS_TOKEN,
  GAS_FEE_EVMOS,
  GAS_FEE_JUNO,
  GAS_FEE_OSMOSIS,
  GAS_FEE_THETA,
  JUNO_PREFIX,
  JUNO_TOKEN,
  MNEMONIC,
  OSMOSIS_PREFIX,
  OSMOSIS_TOKEN,
  TENDERMINT_RPC_EVMOS,
  TENDERMINT_RPC_JUNO,
  TENDERMINT_RPC_OSMOSIS,
  TENDERMINT_RPC_THETA,
  THETA_PREFIX,
  THETA_TOKEN,
} from "../cosmosjs/lib/constant";

const formatedThetaGasFee = ethers.utils.formatEther(GAS_FEE_THETA);
const formatedOsmoGasFee = ethers.utils.formatEther(GAS_FEE_OSMOSIS);
const formatedJunoGasFee = ethers.utils.formatEther(GAS_FEE_JUNO);
const formatedEvmosGasFee = ethers.utils.formatEther(GAS_FEE_EVMOS);

const theta = {
  endpoint: TENDERMINT_RPC_THETA,
  prefix: THETA_PREFIX,
  gasPrice: `${formatedThetaGasFee}${THETA_TOKEN}`,
};

const osmo = {
  endpoint: TENDERMINT_RPC_OSMOSIS,
  prefix: OSMOSIS_PREFIX,
  gasPrice: `${formatedOsmoGasFee}${OSMOSIS_TOKEN}`,
};

const juno = {
  endpoint: TENDERMINT_RPC_JUNO,
  prefix: JUNO_PREFIX,
  gasPrice: `${formatedJunoGasFee}${JUNO_TOKEN}`,
};

const evmos = {
  endpoint: TENDERMINT_RPC_EVMOS,
  prefix: EVMOS_PREFIX,
  gasPrice: `${formatedEvmosGasFee}${EVMOS_TOKEN}`,
};

const main = async () => {
  const thetaSiger = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: theta.prefix,
  });

  const osmoSigner = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: osmo.prefix,
  });

  const junoSigner = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: juno.prefix,
  });

  const evmosSigner = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: evmos.prefix,
  });

  const [thetaAccount] = await thetaSiger.getAccounts();
  const [osmoAccount] = await osmoSigner.getAccounts();
  const [junoAccount] = await junoSigner.getAccounts();
  const [evmosAccount] = await evmosSigner.getAccounts();

  const thetaGasPrice = GasPrice.fromString(theta.gasPrice);
  const thetaClient = await IbcClient.connectWithSigner(theta.endpoint, thetaSiger, thetaAccount.address, {
    prefix: theta.prefix,
    gasPrice: thetaGasPrice,
  });

  const osmoGasPrice = GasPrice.fromString(osmo.gasPrice);
  const osmoClient = await IbcClient.connectWithSigner(osmo.endpoint, osmoSigner, osmoAccount.address, {
    prefix: osmo.prefix,
    gasPrice: osmoGasPrice,
  });

  const junoGasPrice = GasPrice.fromString(juno.gasPrice);
  const junoClient = await IbcClient.connectWithSigner(juno.endpoint, junoSigner, junoAccount.address, {
    prefix: juno.prefix,
    gasPrice: junoGasPrice,
  });

  const evmosGasPrice = GasPrice.fromString(evmos.gasPrice);
  const evmosClient = await IbcClient.connectWithSigner(evmos.endpoint, evmosSigner, evmosAccount.address, {
    prefix: evmos.prefix,
    gasPrice: evmosGasPrice,
  });

  const link = await Link.createWithNewConnections(thetaClient, osmoClient);
  console.log(link);
  // await link.createChannel("A", "transfer", "transfer", 1, "ics20-1");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

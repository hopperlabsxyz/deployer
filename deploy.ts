#!/usr/bin/env bun

import { type Address, type Hex, type Prettify } from "viem";
import { readFileSync } from "fs";
import { join } from "path";
import { account, assertValidChainId, assertVersionSupported, createChainClients } from "./src/client"
import { addresses, ChainId, type VersionOrLatest } from "@lagoon-protocol/v0-core";
import type { Config, VaultConfig, VaultInit } from './src/type';
import optinFactoryAbi from "./src/abis/optinFactoryAbi";

async function deployWithOptinFactory(
  chainId: number,
  factory: Address,
  {
    _logic,
    _initialOwner,
    _initialDelay,
    _init,
    salt
  }: { _logic: Address, _initialOwner: Address, _initialDelay: bigint, _init: Prettify<VaultInit>, salt: Hex }
) {
  assertValidChainId(chainId)
  const { publicClient, walletClient } = createChainClients(chainId);
  const hash = await walletClient.writeContract({
    address: factory,
    abi: optinFactoryAbi,
    functionName: 'createVaultProxy',
    args: [_logic, _initialOwner, _initialDelay, _init, salt],
  });
  await publicClient.waitForTransactionReceipt({ hash })
  return hash;
}

async function simulateWithOptinFactory(
  chainId: number,
  factory: Address,
  {
    _logic,
    _initialOwner,
    _initialDelay,
    _init,
    salt
  }: { _logic: Address, _initialOwner: Address, _initialDelay: bigint, _init: Prettify<VaultInit>, salt: Hex }
) {
  assertValidChainId(chainId)
  const { publicClient } = createChainClients(chainId);
  return publicClient.simulateContract({
    address: factory,
    abi: optinFactoryAbi,
    functionName: 'createVaultProxy',
    args: [_logic, _initialOwner, _initialDelay, _init, salt],
    account
  });
}

function getDeploymentAddresses(chainId: ChainId, version: VersionOrLatest) {
  assertValidChainId(chainId);
  assertVersionSupported(chainId, version)
  const deployAddress: Address = addresses[chainId].optinFactory
  if (version === 'latest') {
    return {
      deployAddress,
      logicAddress: '0x0000000000000000000000000000000000000000' as Address
    }
  }
  if (!addresses[chainId].hasOwnProperty(version)) throw new Error(`Error while getting deployement addresses on chain id ${chainId} and version ${version}`)
  const logicAddress: Address = (addresses as any)[chainId][version];
  return {
    deployAddress,
    logicAddress
  }
}

async function deployOnMainnet({ vaultConfig, chainId, simulate = true }: { vaultConfig: VaultConfig, chainId: number, simulate: boolean }) {
  const { version, salt } = vaultConfig
  const { logicAddress, deployAddress } = getDeploymentAddresses(chainId, version)
  const _initialDelay = vaultConfig.initialDelay ? BigInt(vaultConfig.initialDelay) : 86400n // 1day
  const _initialOwner = vaultConfig.safe
  const deploy = simulate ? simulateWithOptinFactory : deployWithOptinFactory
  const vaultInit: VaultInit = {
    underlying: vaultConfig.underlying,
    name: vaultConfig.name,
    symbol: vaultConfig.symbol,
    safe: vaultConfig.safe,
    admin: vaultConfig.admin,
    whitelistManager: vaultConfig.whitelistManager,
    feeReceiver: vaultConfig.feeReceiver,
    valuationManager: vaultConfig.valuationManager,
    performanceRate: vaultConfig.performanceRate,
    managementRate: vaultConfig.managementRate,
    rateUpdateCooldown: BigInt(vaultConfig.rateUpdateCooldown),
    enableWhitelist: vaultConfig.enableWhitelist,
  }
  return deploy(
    chainId,
    deployAddress,
    {
      _logic: logicAddress,
      _initialOwner,
      _initialDelay,
      _init: vaultInit,
      salt: salt ?? "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  );
}

async function main() {
  try {
    // We do a simulation by default
    const simulate = !process.argv.includes('--broadcast');

    // Load config from JSON file
    const configPath = join(process.cwd(), 'config.json');
    const configData = readFileSync(configPath, 'utf-8');
    const config: Config = JSON.parse(configData);

    const { chainId, vaultsToDeploy } = config;
    const responses: any[] = []

    console.log(simulate ? 'Running simulation...' : 'Deploying vaults...');

    for (let i = 0; i < vaultsToDeploy.length; i++) {
      const vaultConfig = vaultsToDeploy[i]
      if (vaultConfig) {
        const res = await deployOnMainnet({ vaultConfig, chainId, simulate })
        responses.push(res)
      }
    }

    console.log(responses)

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

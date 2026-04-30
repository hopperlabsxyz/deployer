#!/usr/bin/env bun

import { join } from "path";
import { decodeEventLog, type Address, type Hex } from "viem";
import { account, chains, createChainClients } from "./src/client";
import {
  getDeployerAddress,
  getImplementationAddress,
  type LagoonVersion,
} from "./src/addresses";
import optinFactoryAbi from "./src/abis/optinFactoryAbi";
import { buildInitCallData } from "./src/encoding";
import type { Config, VaultConfig } from "./src/type";
import { assertValidChainId, generateRandomBytes32 } from "./src/utils";

type CreateArgs = {
  _logic: Address;
  _initialOwner: Address;
  _initialDelay: bigint;
  call_data: Hex;
  salt: Hex;
};

type DeployResult = {
  vault: Address;
  hash?: Hex;
};

async function deployWithOptinFactory(
  chainId: number,
  factory: Address,
  args: CreateArgs
): Promise<DeployResult> {
  const { publicClient, walletClient } = createChainClients(chainId);
  const hash = await walletClient.writeContract({
    address: factory,
    abi: optinFactoryAbi,
    functionName: "createVaultProxy",
    args: [
      args._logic,
      args._initialOwner,
      args._initialDelay,
      args.call_data,
      args.salt,
    ],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  let vault: Address | undefined;
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== factory.toLowerCase()) continue;
    try {
      const decoded = decodeEventLog({
        abi: optinFactoryAbi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === "ProxyDeployed") {
        vault = (decoded.args as { proxy: Address }).proxy;
        break;
      }
    } catch {
      // not our event
    }
  }

  if (!vault)
    throw new Error(
      `ProxyDeployed event missing from tx ${hash} — deployment status unknown`
    );

  return { hash, vault };
}

async function simulateWithOptinFactory(
  chainId: number,
  factory: Address,
  args: CreateArgs
): Promise<DeployResult> {
  const { publicClient } = createChainClients(chainId);
  const { result } = await publicClient.simulateContract({
    address: factory,
    abi: optinFactoryAbi,
    functionName: "createVaultProxy",
    args: [
      args._logic,
      args._initialOwner,
      args._initialDelay,
      args.call_data,
      args.salt,
    ],
    account,
  });
  return { vault: result as Address };
}

async function readFactoryContext(chainId: number, factory: Address) {
  const { publicClient } = createChainClients(chainId);
  const [feeRegistry, wrappedNativeToken] = await Promise.all([
    publicClient.readContract({
      address: factory,
      abi: optinFactoryAbi,
      functionName: "registry",
    }),
    publicClient.readContract({
      address: factory,
      abi: optinFactoryAbi,
      functionName: "wrappedNativeToken",
    }),
  ]);
  return { feeRegistry, wrappedNativeToken };
}

async function deploy({
  vaultConfig,
  chainId,
  simulate,
}: {
  vaultConfig: VaultConfig;
  chainId: number;
  simulate: boolean;
}): Promise<DeployResult> {
  assertValidChainId(chainId);
  const factory = getDeployerAddress(chainId);
  const logicAddress = getImplementationAddress(
    chainId,
    vaultConfig.version as LagoonVersion
  );

  const { feeRegistry, wrappedNativeToken } = await readFactoryContext(
    chainId,
    factory
  );

  const call_data = buildInitCallData(
    vaultConfig,
    feeRegistry,
    wrappedNativeToken
  );

  const _initialDelay = vaultConfig.initialDelay
    ? BigInt(vaultConfig.initialDelay)
    : 86400n; // 1 day
  const _initialOwner = vaultConfig.initialOwner ?? vaultConfig.admin;

  const run = simulate ? simulateWithOptinFactory : deployWithOptinFactory;
  return run(chainId, factory, {
    _logic: logicAddress,
    _initialOwner,
    _initialDelay,
    call_data,
    salt: vaultConfig.salt ?? generateRandomBytes32(),
  });
}

function explorerBase(chainId: number): string | undefined {
  const chain = chains[chainId as keyof typeof chains];
  return chain?.blockExplorers?.default?.url;
}

function printResult(chainId: number, res: DeployResult, simulate: boolean) {
  const base = explorerBase(chainId);
  if (res.hash) {
    const txLink = base ? `${base}/tx/${res.hash}` : res.hash;
    console.log(`  tx:    ${txLink}`);
  }
  const vaultLink = `https://app.lagoon.finance/vault/${chainId}/${res.vault}`;
  const label = simulate ? "predicted vault" : "vault";
  console.log(`  ${label}: ${vaultLink}`);
}

async function main() {
  try {
    const argv = process.argv.slice(2);
    const simulate = !argv.includes("--broadcast");
    const configArg = argv.find((a) => !a.startsWith("--")) ?? "config.jsonc";

    const configPath = join(process.cwd(), configArg);
    const config: Config = (await import(configPath)).default;

    const { chainId, vaultsToDeploy } = config;

    console.log(simulate ? "Running simulation..." : "Deploying vaults...");

    for (const vaultConfig of vaultsToDeploy) {
      if (!vaultConfig) continue;
      const res = await deploy({ vaultConfig, chainId, simulate });
      printResult(chainId, res, simulate);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();

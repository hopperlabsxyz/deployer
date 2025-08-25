import { type Address, type Hex } from "viem";
import { readFileSync } from "fs";
import { join } from "path";
import { optiFactoryAbi } from "./abi";
import { account, assertValidChainId, clients } from "./client"
import { addresses } from "@lagoon-protocol/v0-core";

// Infos used to init a vault proxy on factory v1
interface VaultInit {
  underlying: Address;
  name: string;
  safe: Address;
  symbol: string,
  whitelistManager: Address;
  valuationManager: Address;
  admin: Address;
  feeReceiver: Address;
  managementRate: number;
  performanceRate: number;
  enableWhitelist: boolean;
  rateUpdateCooldown: bigint;
}

interface Config {
  chainId: number;
  simulate: boolean;
  vaultsToDeploy: Omit<VaultInit, 'rateUpdateCooldown'> & { rateUpdateCooldown: string }[];
}

// Load config from JSON file
const configPath = join(process.cwd(), 'config.json');
const configData = readFileSync(configPath, 'utf-8');
const rawConfig: Config = JSON.parse(configData);

// Convert string rateUpdateCooldown to bigint
const config: { chainId: number, vaultsToDeploy: VaultInit[], simulate: boolean } = {
  chainId: rawConfig.chainId,
  vaultsToDeploy: rawConfig.vaultsToDeploy.map((vault) => ({
    ...vault,
    rateUpdateCooldown: BigInt(vault.rateUpdateCooldown)
  } as VaultInit)),
  simulate: rawConfig.simulate
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {}

async function deployWithOptinFactory(
  chainId: number,
  factory: Address,
  {
    _logic,
    _initialOwner,
    _initialDelay,
    _init,
    salt
  }: { _logic: Address, _initialOwner: Address, _initialDelay: number, _init: Prettify<VaultInit>, salt: Hex }
) {
  assertValidChainId(chainId)
  const client = clients[chainId].walletClient
  const publicClient = clients[chainId].publicClient
  const hash = await client.writeContract({
    address: factory,
    abi: optiFactoryAbi,
    functionName: 'createVaultProxy',
    args: [_logic, _initialOwner, _initialDelay, _init, salt]
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
  }: { _logic: Address, _initialOwner: Address, _initialDelay: number, _init: Prettify<VaultInit>, salt: Hex }
) {
  assertValidChainId(chainId)
  const client = clients[chainId].publicClient
  return client.simulateContract({
    address: factory,
    abi: optiFactoryAbi,
    functionName: 'createVaultProxy',
    args: [_logic, _initialOwner, _initialDelay, _init, salt],
    account
  });
}

async function deployOnMainnet({ vaultInit, chainId, simulate = true }: { vaultInit: VaultInit, chainId: number, simulate: boolean }) {
  assertValidChainId(chainId)
  const { optinFactory, v0_5_0 } = addresses[chainId]
  const _initialDelay = 86400
  const _initialOwner = vaultInit.safe
  const deploy = simulate ? simulateWithOptinFactory : deployWithOptinFactory
  return deploy(
    chainId,
    optinFactory,
    {
      _logic: v0_5_0,
      _initialOwner,
      _initialDelay,
      _init: vaultInit,
      salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  );
}

const { chainId, vaultsToDeploy, simulate } = config;
const responses: any[] = []
for (let i = 0; i < vaultsToDeploy.length; i++) {
  const vaultInit = vaultsToDeploy[i]
  if (vaultInit) {
    const res = await deployOnMainnet({ vaultInit, chainId, simulate })
    responses.push(res)
  }
}
console.log(responses)


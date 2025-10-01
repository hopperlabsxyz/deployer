import type { ChainId, VersionOrLatest } from "@lagoon-protocol/v0-core";
import type { Hex } from "viem";

type Address = `0x${string}`;

export type VaultInit = {
  underlying: Address;
  name: string;
  symbol: string;
  safe: Address;
  admin: Address;
  whitelistManager: Address;
  feeReceiver: Address;
  valuationManager: Address;
  performanceRate: number;
  managementRate: number;
  rateUpdateCooldown: bigint;
  enableWhitelist: boolean;
};

export type Config = {
  chainId: ChainId;

  vaultsToDeploy: VaultConfig[];
};

export type VaultConfig = {
  version: VersionOrLatest;
  initialDelay?: number | string;
  initialOwner?: Address;
  underlying: Address;
  name: string;
  symbol: string;
  safe: Address;
  admin: Address;
  whitelistManager: Address;
  feeReceiver: Address;
  valuationManager: Address;
  performanceRate: number;
  managementRate: number;
  rateUpdateCooldown: number | string;
  enableWhitelist: boolean;
  salt?: Hex;
};

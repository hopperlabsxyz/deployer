import type { Address, Hex } from "viem";
import type { LagoonVersion } from "./addresses";

type BaseVaultConfig = {
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
  managementRate: number;
  performanceRate: number;
  salt?: Hex;
};

export type VaultConfigV5 = BaseVaultConfig & {
  version: "v0.4.0" | "v0.5.0";
  enableWhitelist: boolean;
  rateUpdateCooldown: number | string;
};

export type AccessMode = "Blacklist" | "Whitelist";

export type VaultConfigV6 = BaseVaultConfig & {
  version: "v0.6.0";
  accessMode: AccessMode;
  entryRate: number;
  exitRate: number;
  haircutRate: number;
  securityCouncil: Address;
  initialTotalAssets: number | string;
  superOperator: Address;
  allowHighWaterMarkReset: boolean;
};

export type VaultConfig = VaultConfigV5 | VaultConfigV6;

export type Config = {
  chainId: number;
  vaultsToDeploy: VaultConfig[];
};

export type { LagoonVersion };

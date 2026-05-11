import {
  encodeAbiParameters,
  encodeFunctionData,
  type Address,
  type Hex,
} from "viem";
import type { VaultConfig, VaultConfigV5, VaultConfigV6 } from "./type";

// InitStruct layout for v0.4.0 and v0.5.x — both have identical fields.
const INIT_STRUCT_V5 = [
  {
    type: "tuple",
    components: [
      { name: "underlying", type: "address" },
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "safe", type: "address" },
      { name: "whitelistManager", type: "address" },
      { name: "valuationManager", type: "address" },
      { name: "admin", type: "address" },
      { name: "feeReceiver", type: "address" },
      { name: "managementRate", type: "uint16" },
      { name: "performanceRate", type: "uint16" },
      { name: "enableWhitelist", type: "bool" },
      { name: "rateUpdateCooldown", type: "uint256" },
    ],
  },
] as const;

// InitStruct layout for v0.6.0.
const INIT_STRUCT_V6 = [
  {
    type: "tuple",
    components: [
      { name: "underlying", type: "address" },
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "safe", type: "address" },
      { name: "whitelistManager", type: "address" },
      { name: "valuationManager", type: "address" },
      { name: "admin", type: "address" },
      { name: "feeReceiver", type: "address" },
      { name: "managementRate", type: "uint16" },
      { name: "performanceRate", type: "uint16" },
      { name: "accessMode", type: "uint8" },
      { name: "entryRate", type: "uint16" },
      { name: "exitRate", type: "uint16" },
      { name: "haircutRate", type: "uint16" },
      { name: "securityCouncil", type: "address" },
      { name: "externalSanctionsList", type: "address" },
      { name: "initialTotalAssets", type: "uint256" },
      { name: "superOperator", type: "address" },
      { name: "allowHighWaterMarkReset", type: "bool" },
    ],
  },
] as const;

// Vault.initialize(bytes data, address feeRegistry, address wrappedNativeToken)
const INITIALIZE_ABI = [
  {
    type: "function",
    name: "initialize",
    stateMutability: "nonpayable",
    inputs: [
      { name: "data", type: "bytes" },
      { name: "feeRegistry", type: "address" },
      { name: "wrappedNativeToken", type: "address" },
    ],
    outputs: [],
  },
] as const;

function encodeInitV5(cfg: VaultConfigV5): Hex {
  return encodeAbiParameters(INIT_STRUCT_V5, [
    {
      underlying: cfg.underlying,
      name: cfg.name,
      symbol: cfg.symbol,
      safe: cfg.safe,
      whitelistManager: cfg.whitelistManager,
      valuationManager: cfg.valuationManager,
      admin: cfg.admin,
      feeReceiver: cfg.feeReceiver,
      managementRate: cfg.managementRate,
      performanceRate: cfg.performanceRate,
      enableWhitelist: cfg.enableWhitelist,
      rateUpdateCooldown: BigInt(cfg.rateUpdateCooldown),
    },
  ]);
}

function encodeInitV6(cfg: VaultConfigV6): Hex {
  const accessMode = cfg.accessMode === "Whitelist" ? 1 : 0;
  return encodeAbiParameters(INIT_STRUCT_V6, [
    {
      underlying: cfg.underlying,
      name: cfg.name,
      symbol: cfg.symbol,
      safe: cfg.safe,
      whitelistManager: cfg.whitelistManager,
      valuationManager: cfg.valuationManager,
      admin: cfg.admin,
      feeReceiver: cfg.feeReceiver,
      managementRate: cfg.managementRate,
      performanceRate: cfg.performanceRate,
      accessMode,
      entryRate: cfg.entryRate,
      exitRate: cfg.exitRate,
      haircutRate: cfg.haircutRate,
      securityCouncil: cfg.securityCouncil,
      // Forced to address(0) — the deployer never enrolls a sanctions oracle.
      externalSanctionsList: "0x0000000000000000000000000000000000000000",
      initialTotalAssets: BigInt(cfg.initialTotalAssets),
      superOperator: cfg.superOperator,
      allowHighWaterMarkReset: cfg.allowHighWaterMarkReset,
    },
  ]);
}

/**
 * Build the `call_data` bytes blob passed to `OptinProxyFactory.createVaultProxy`.
 * Encodes a call to `Vault.initialize(bytes data, address feeRegistry, address wrappedNativeToken)`
 * where `data` is the ABI-encoded version-specific `InitStruct`.
 */
export function buildInitCallData(
  cfg: VaultConfig,
  feeRegistry: Address,
  wrappedNativeToken: Address
): Hex {
  const encodedInit =
    cfg.version === "v0.6.0" ? encodeInitV6(cfg) : encodeInitV5(cfg);

  return encodeFunctionData({
    abi: INITIALIZE_ABI,
    functionName: "initialize",
    args: [encodedInit, feeRegistry, wrappedNativeToken],
  });
}

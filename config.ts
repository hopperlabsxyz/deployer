#!/usr/bin/env bun

import { ChainId } from "@lagoon-protocol/v0-core";
import type { Config } from "./src/type";

const ROLE = "0x1a90000000000000000000000000000000000000" as const;
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as const;
const ZERO = "0x0000000000000000000000000000000000000000" as const;

export const config: Config = {
  // EIP-155 chain ID. Factory + implementation must be deployed on this chain.
  // See src/addresses.ts for the supported set.
  // Examples: 1 = Ethereum, 8453 = Base, 42161 = Arbitrum, 137 = Polygon.
  chainId: ChainId.EthMainnet,
  vaultsToDeploy: [
    {
      // Vault implementation version. "v0.4.0" | "v0.5.0" | "v0.6.0".
      // Per-chain availability: see `addresses` in @lagoon-protocol/v0-core.
      // v0.5/v0.6 have different InitStruct shapes — see src/type.ts.
      version: "v0.6.0",
      // Minimum delay (seconds) before the proxy admin can push an upgrade.
      // Min/default: 86400 (1 day). Max: 2592000 (30 days).
      initialDelay: 86400,
      // Address authorised to manage proxy upgrades.
      // Optional — defaults to `admin` if omitted.
      initialOwner: ROLE,
      // Address of the ERC20 underlying asset (e.g. WETH, USDC).
      underlying: WETH,
      // ERC20 name of the vault share token.
      name: "Test v0.6",
      // ERC20 symbol of the vault share token.
      symbol: "tv6",
      // Safe/multisig that owns the vault (can settle, pause, close, etc).
      safe: ROLE,
      // Vault admin. Can rotate roles (feeReceiver, whitelistManager, ...).
      admin: ROLE,
      // Manages the whitelist/blacklist when accessMode = "Whitelist".
      // Set to 0x0…0 if you don't intend to gate access.
      whitelistManager: ZERO,
      // Receives management + performance fees.
      feeReceiver: ROLE,
      // Pushes new totalAssets valuations.
      valuationManager: ROLE,
      // Management fee, in basis points. 100 = 1%, 1000 = 10%.
      // Max: MAX_MANAGEMENT_RATE = 1000 (10%).
      managementRate: 100,
      // Performance fee, in basis points. 1000 = 10%, 2000 = 20%.
      // Max: MAX_PERFORMANCE_RATE = 5000 (50%).
      performanceRate: 1000,
      // v0.6 only. "Blacklist" (open; deny-listed addresses only) or
      // "Whitelist" (closed; only whitelisted addresses can deposit).
      accessMode: "Blacklist",
      // v0.6 only. Entry fee, in basis points. 0 to disable.
      // Max: MAX_ENTRY_RATE = 200 (2%).
      entryRate: 0,
      // v0.6 only. Exit fee (async withdraw), in basis points. 0 to disable.
      // Max: MAX_EXIT_RATE = 200 (2%).
      exitRate: 0,
      // v0.6 only. Haircut applied on synchronous redeems, in basis points.
      // 0 to disable. Max: MAX_HAIRCUT_RATE = 2000 (20%).
      haircutRate: 0,
      // v0.6 only. Security council address — emergency pause powers.
      // Set to 0x0…0 to disable.
      securityCouncil: ROLE,
      // v0.6 only. External sanctions list contract (OFAC-like oracle).
      // Chainalysis default on Ethereum: 0x40C57923924B5c5c5455c48D93317139ADDaC8fb
      // Set to 0x0…0 if you don't want to consult one.
      externalSanctionsList: ZERO,
      // v0.6 only. Initial totalAssets (uint256). Use 0 for fresh vaults;
      // non-zero is meant for migrations that carry an existing balance.
      initialTotalAssets: 0,
      // v0.6 only. Super operator — can act on behalf of controllers.
      // Set to 0x0…0 to disable.
      superOperator: ROLE,
      // v0.6 only. If true, the safe can reset the high-water mark to the
      // current price-per-share (e.g. after a drawdown).
      allowHighWaterMarkReset: false,
      // Optional (all versions). 32-byte hex salt for CREATE2.
      // Omit for a random salt per deploy; pin for a deterministic address.
      salt: "0x0000000000000000000000000000000000000000000000000000000F00000000",
    },
  ],
};

console.log(JSON.stringify(config, undefined, 2));

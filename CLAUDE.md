# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

One-shot Bun/TypeScript script that deploys Lagoon v0 vault proxies by calling `createVaultProxy` on the on-chain `OptinProxyFactory` (protocol-v3). Not a service — runs once per invocation, simulates by default, broadcasts only with `--broadcast`.

## Commands

```bash
bun install                    # install deps
./config.ts > config.jsonc      # regenerate config.jsonc from config.ts (required before deploy.ts reads it)
./deploy.ts                    # simulate (default)
./deploy.ts --broadcast        # actually send txs
```

Both `.ts` files have `#!/usr/bin/env bun` shebangs and are executed directly. `PRIVATE_KEY=0x…` must be set in `.env` (loaded via `Bun.env`).

There is no test, lint, or build step. `bunx tsc --noEmit` is the only typecheck.

## Architecture

**Two-stage config flow.** `config.ts` is the authored source — it imports `ChainId` and the `Config` type, then prints JSON to stdout. `deploy.ts` only ever reads `config.jsonc`. Editing `config.ts` without regenerating `config.jsonc` is a silent no-op. Keep this split in mind when making changes: anything that needs typed chain IDs or enum access must live in `config.ts`; `deploy.ts` sees only the serialized form.

**Factory call format (protocol-v3).** `deploy.ts` calls the bytes-based overload:
```
createVaultProxy(address _logic, address _initialOwner, uint256 _initialDelay, bytes call_data, bytes32 salt)
```
`call_data` is an ABI-encoded call to `Vault.initialize(bytes data, address feeRegistry, address wrappedNativeToken)`, where `data` is the ABI-encoded version-specific `InitStruct`. `feeRegistry` and `wrappedNativeToken` are read live from the factory via `registry()` / `wrappedNativeToken()` before each deploy — don't hardcode them.

The v3 OptinProxyFactory is not yet live on-chain at the time of writing; the script will revert against the current v2 factory because the bytes-overload selector doesn't exist. That is the expected failure mode until the upgrade ships.

**Version / InitStruct encoding** (`src/encoding.ts`): v0.4 and v0.5 share the same InitStruct layout; v0.6 has a different one (adds `accessMode` enum, entry/exit/haircut rates, securityCouncil, externalSanctionsList, initialTotalAssets, superOperator, allowHighWaterMarkReset; drops `enableWhitelist`/`rateUpdateCooldown`). `VaultConfig` is a discriminated union on `version` — adding a new version means a new variant here plus a new tuple in `encoding.ts`.

**Addresses** (`src/addresses.ts`): both the factory address per chain (`DEPLOYER_BY_CHAIN`) and the vault implementation address per (chain, version) (`IMPLEMENTATIONS_BY_CHAIN`) are owned by this repo. Factories come from https://docs.lagoon.finance/resources/networks-and-addresses; implementations from `@lagoon-protocol/v0-core` addresses (sdk-v0). Both are lower-cased hex. When a new chain or version is added, edit this file — the `@lagoon-protocol/v0-core` `addresses` map is no longer consulted.

**Chain registry** (`src/client.ts`): maps `ChainId` (from `@lagoon-protocol/v0-core`) → viem `Chain` object. HyperEVM is defined inline (not in viem) using `ChainUtils.CHAIN_METADATA` + the drpc.org RPC. Adding a new chain requires extending `chains` here AND adding a `DEPLOYER_BY_CHAIN` / `IMPLEMENTATIONS_BY_CHAIN` entry.

**Salt**: `vaultConfig.salt` is optional; when absent a random 32-byte salt is generated per deploy (`src/utils.ts` `generateRandomBytes32`). Successive simulate/broadcast runs therefore compute different CREATE2 addresses — don't rely on simulation to predict the deployed address unless salt is pinned.

**`initialOwner` fallback**: if not set in config, defaults to `admin` (not to the deployer).

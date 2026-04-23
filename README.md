# Vault Deployment Script

A TypeScript script for deploying vault proxies using the Lagoon Protocol factory contract on various blockchain networks.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- A private key for the deployer account
- Access to the target blockchain network

## Installation

- Install dependencies:

```bash
bun install
```

## Configuration

### 1. Environment Variables

Set the following environment variable:

```bash
PRIVATE_KEY=0x1234567890abcdef... # Your private key with 0x prefix
```

You can use a temporary private key generated with `cast wallet new` for example.

Optional RPC overrides (public RPCs can be slow; simulation in particular
benefits from a faster endpoint):

```bash
# Used for every chain Alchemy supports
ALCHEMY_API_KEY=...

# Per-chain override, wins over ALCHEMY_API_KEY and the viem default.
# Format: RPC_URL_<chainId>=<url>
RPC_URL_1=https://ethereum-rpc.publicnode.com
RPC_URL_8453=https://base-rpc.publicnode.com
```

See `.env.example` for the full list of Alchemy-supported chains.

### 2. Config File

Edit the `config.ts` file in the project root with your deployment configuration:

```typescript
import type { Config } from "./src/type";

export const config: Config = {
  chainId: 43114,
  vaultsToDeploy: [
    {
      version: "v0.5.0", // "v0.4.0" | "v0.5.0" | "v0.6.0"
      underlying: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      name: "My Vault",
      symbol: "myVault",
      safe: "0x987dac2F8994785392a256b68A54a79f2327Ac97",
      admin: "0x987dac2F8994785392a256b68A54a79f2327Ac97",
      whitelistManager: "0x0000000000000000000000000000000000000000",
      feeReceiver: "0x6fF36F81e326E7E5117eBa37A6bfCe9a44D17177",
      valuationManager: "0xD1Ff17F544d7CA5138C25874b16eF801aC113882",
      performanceRate: 2000,
      managementRate: 0,
      rateUpdateCooldown: 0,
      enableWhitelist: false,
    },
  ],
};
```

For `v0.6.0` vaults the config shape is different (access mode, entry/exit/haircut rates,
security council, super operator, initial total assets, …). See `config.ts` in the repo
for a commented example.

Then, you can generate the `config.jsonc` file from your typescript code:

```
./config.ts > config.jsonc
```

`config.jsonc` is JSON with `//` and `/* */` comments — `deploy.ts` strips them
before parsing. Regenerating from `config.ts` will overwrite any hand-written
comments in the `.jsonc` file.

#### Configuration Parameters

For more details, please refer to the [Create your vault](https://docs.lagoon.finance/vault/create-your-vault) documentation.

`config.jsonc` ships with per-field comments explaining every value and its
allowed range; see that file for the canonical list.

## Usage

### Deploy Vaults

To test your configuration without actual deployment run:

```bash
./deploy.ts
```

This will validate your configuration and show what would be deployed without executing transactions.

Then you can broadcast your deployment running:

```bash
./deploy.ts --broadcast
```

You can also point the script at an alternative config file (handy for keeping
separate configs per version or per network):

```bash
./deploy.ts config0.5.jsonc
./deploy.ts config0.5.jsonc --broadcast
```

## Output

For each vault, the script prints the vault URL on Lagoon and — for broadcasts
— an explorer link to the deployment transaction:

```
Running simulation...
  predicted vault: https://app.lagoon.finance/vault/1/0x7785ff62AC3887A2867CD0948ff6d5D160CEB6B0

Deploying vaults...
  tx:    https://etherscan.io/tx/0xabcdef1234567890...
  vault: https://app.lagoon.finance/vault/1/0x7785ff62AC3887A2867CD0948ff6d5D160CEB6B0
```

In simulation the vault address is the CREATE2 prediction; pin `salt` in the
config to keep it stable across runs.

## Security Notes

- Keep your private key secure and never commit it to version control
- Verify all addresses in your config file are correct
- Ensure the deployer account has sufficient native tokens for gas fees
- Use simulation mode to test configurations before actual deployment

## Troubleshooting

- **"PRIVATE_KEY not a `0x${string}`"**: Ensure your private key starts with `0x`
- **"Chain id X not supported"**: Check that the chainId in config.ts matches a supported network
- **Transaction failures**: Verify all addresses exist and the deployer has sufficient gas funds

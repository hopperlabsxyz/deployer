# Vault Deployment Script

A TypeScript script for deploying vault proxies using the Lagoon Protocol factory contract on various blockchain networks.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- A private key for the deployer account
- Access to the target blockchain network

## Installation

* Install dependencies:
```bash
bun install
```

## Configuration

### 1. Environment Variables

Set the following environment variable:

```bash
PRIVATE_KEY=0x1234567890abcdef... # Your private key with 0x prefix
```

You can use a temporary private key generated with `cast wallet new` for example

### 2. Config File

Edit the `config.ts` file in the project root with your deployment configuration:

```typescript
import type { Config } from "./src/type";

export const config: Config = {
  chainId: 43114,
  vaultsToDeploy: [
    {
      version: "latest",
      underlying: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      name: "Turtle Avalanche BTC.b",
      symbol: "turtleAvalancheBTC.b",
      safe: "0x987dac2F8994785392a256b68A54a79f2327Ac97",
      admin: "0x987dac2F8994785392a256b68A54a79f2327Ac97",
      whitelistManager: "0x0000000000000000000000000000000000000000",
      feeReceiver: "0x6fF36F81e326E7E5117eBa37A6bfCe9a44D17177",
      valuationManager: "0xD1Ff17F544d7CA5138C25874b16eF801aC113882",
      performanceRate: 2000,
      managementRate: 0,
      rateUpdateCooldown: 0,
      enableWhitelist: false
    }
  ]
};
```


Then, you can generate the `config.json` file from your typescript code:

```
./config.ts > config.json
```

#### Configuration Parameters

- `chainId`: The blockchain network ID (ex: `1` for Ethereum Mainnet)

- `vaultsToDeploy`: Array of vault configurations
  - `version`: Version of the vault implementation to deploy ("latest" or specific version)
  - `underlying`: Asset address
  - `name`: Vault name
  - `safe`: Address of the Safe/multisig that will own the vault
  - `symbol`: Token symbol for the vault shares
  - `whitelistManager`: Address authorized to manage the whitelist (use zero address to disable)
  - `valuationManager`: Address responsible for asset valuation
  - `admin`: Admin address for the vault
  - `feeReceiver`: Address that will receive fees
  - `managementRate`: Management fee rate (basis points, e.g., 200 = 2%)
  - `performanceRate`: Performance fee rate (basis points, e.g., 2000 = 20%)
  - `enableWhitelist`: Whether to enable investor whitelisting
  - `rateUpdateCooldown`: Cooldown period between rate updates (in seconds)

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


## Output

The script will output an array of transaction hashes for each successful deployment:

```
[
  "0xabcdef1234567890...",
  "0x1234567890abcdef..."
]
```

## Security Notes

- Keep your private key secure and never commit it to version control
- Verify all addresses in your config file are correct
- Ensure the deployer account has sufficient native tokens for gas fees
- Use simulation mode to test configurations before actual deployment

## Troubleshooting

- **"PRIVATE_KEY not a `0x${string}`"**: Ensure your private key starts with `0x`
- **"Chain id X not supported"**: Check that the chainId in config.ts matches a supported network
- **Transaction failures**: Verify all addresses exist and the deployer has sufficient gas funds

# Vault Deployment Script

A TypeScript script for deploying vault proxies using the Lagoon Protocol factory contract on various blockchain networks.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- A private key for the deployer account
- Access to the target blockchain network

## Installation

* Install dependencies:
```bash
bun install viem @lagoon-protocol/v0-core
```

## Configuration

### 1. Environment Variables

Set the following environment variable:

```bash
PRIVATE_KEY=0x1234567890abcdef... # Your private key with 0x prefix
```

You can use a temporary private key generated with `cast wallet new` for example

### 2. Config File

Create a `config.json` file in the project root with your deployment configuration:

```json
{
  "chainId": 43114,
  "vaultsToDeploy": [
    {
      "underlying": "0x1234567890123456789012345678901234567890",
      "name": "My Vault",
      "safe": "0x1234567890123456789012345678901234567890",
      "symbol": "VAULT",
      "whitelistManager": "0x1234567890123456789012345678901234567890",
      "valuationManager": "0x1234567890123456789012345678901234567890",
      "admin": "0x1234567890123456789012345678901234567890",
      "feeReceiver": "0x1234567890123456789012345678901234567890",
      "managementRate": 200,
      "performanceRate": 2000,
      "enableWhitelist": false,
      "rateUpdateCooldown": "86400"
    }
  ]
}
```

#### Configuration Parameters

- `chainId`: The blockchain network ID
  - `1`: Ethereum Mainnet
  - `43114`: Avalanche C-Chain
  - `747474`: Katana Network
  - `14853`: TAC Network

- `vaultsToDeploy`: Array of vault configurations
  - `underlying`: asset address
  - `name`: Vault name
  - `safe`: Address of the Safe/multisig that will own the vault
  - `symbol`: Token symbol for the vault shares
  - `whitelistManager`: Address authorized to manage the whitelist
  - `valuationManager`: Address responsible for asset valuation
  - `admin`: Admin address for the vault
  - `feeReceiver`: Address that will receive fees
  - `managementRate`: Management fee rate (basis points, e.g., 200 = 2%)
  - `performanceRate`: Performance fee rate (basis points, e.g., 2000 = 20%)
  - `enableWhitelist`: Whether to enable investor whitelisting
  - `rateUpdateCooldown`: Cooldown period between rate updates (in seconds as string)

## Usage

### Deploy Vaults

Run the script to deploy all configured vaults:

```bash
bun run deploy.ts
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

## Troubleshooting

- **"PRIVATE_KEY not a `0x${string}`"**: Ensure your private key starts with `0x`
- **"Chain id X not supported"**: Check that the chainId in config.json matches a supported network
- **Transaction failures**: Verify all addresses exist and the deployer has sufficient gas funds


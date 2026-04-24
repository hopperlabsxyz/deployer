#!/usr/bin/env bun

import { ChainId } from "@lagoon-protocol/v0-core";
import type { Config } from "./src/type";

const ROLE = "0x8e65743e23Ed13f593E7d4eb7ED3ddE1E1cB9bBf" as const;
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as const;

export const config: Config = {
  chainId: ChainId.EthMainnet,
  vaultsToDeploy: [
    {
      version: "v0.6.0",
      initialDelay: 86400,
      initialOwner: ROLE,
      underlying: WETH,
      name: "Test v0.6",
      symbol: "tv6",
      safe: ROLE,
      admin: ROLE,
      whitelistManager: ROLE,
      feeReceiver: ROLE,
      valuationManager: ROLE,
      managementRate: 100,   // 1%   (bps)
      performanceRate: 1000, // 10%  (bps)
      accessMode: "Blacklist",
      entryRate: 0,
      exitRate: 0,
      haircutRate: 0,
      securityCouncil: ROLE,
      externalSanctionsList: "0x0000000000000000000000000000000000000000",
      initialTotalAssets: 0,
      superOperator: ROLE,
      allowHighWaterMarkReset: false,
    },
  ],
};

console.log(JSON.stringify(config, undefined, 2));

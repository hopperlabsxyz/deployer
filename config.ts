#!/usr/bin/env bun

import { ChainId } from "@lagoon-protocol/v0-core";
import type { Config } from "./src/type";

export const config: Config = {
  chainId: ChainId.PlasmaMainnet,
  vaultsToDeploy: [
    {
      version: "latest",
      underlying: "0x6100E367285b01F48D07953803A2d8dCA5D19873",
      name: "Test",
      symbol: "test",
      safe: "0x6B474e6006caaf39dE198179e21226d24beC6963",
      admin: "0x6B474e6006caaf39dE198179e21226d24beC6963",
      whitelistManager: "0x0000000000000000000000000000000000000000",
      feeReceiver: "0x6B474e6006caaf39dE198179e21226d24beC6963",
      valuationManager: "0x6B474e6006caaf39dE198179e21226d24beC6963",
      performanceRate: 2000,
      managementRate: 0,
      rateUpdateCooldown: 0,
      enableWhitelist: false
    }
  ]
};

console.log(JSON.stringify(config, undefined, 2))

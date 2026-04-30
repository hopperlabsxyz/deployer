import { addresses } from "@lagoon-protocol/v0-core";
import type { Address } from "viem";

export type LagoonVersion = "v0.4.0" | "v0.5.0" | "v0.6.0";

type SupportedChainId = keyof typeof addresses;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const VERSION_KEY: Record<LagoonVersion, "v0_4_0" | "v0_5_0" | "v0_6_0"> = {
  "v0.4.0": "v0_4_0",
  "v0.5.0": "v0_5_0",
  "v0.6.0": "v0_6_0",
};

function getChainAddresses(chainId: number) {
  const entry = (addresses as Record<number, unknown>)[chainId];
  if (!entry) return undefined;
  return entry as (typeof addresses)[SupportedChainId];
}

export function getDeployerAddress(chainId: number): Address {
  const entry = getChainAddresses(chainId);
  if (!entry)
    throw new Error(`No OptinProxyFactory deployed on chain ${chainId}`);
  return entry.optinFactory as Address;
}

export function getImplementationAddress(
  chainId: number,
  version: LagoonVersion
): Address {
  const entry = getChainAddresses(chainId);
  if (!entry)
    throw new Error(`Chain ${chainId} has no known Lagoon implementations`);

  const key = VERSION_KEY[version];
  const addr = (entry as Record<string, string | undefined>)[key];

  if (!addr || addr.toLowerCase() === ZERO_ADDRESS) {
    const available = (Object.keys(VERSION_KEY) as LagoonVersion[]).filter(
      (v) => {
        const a = (entry as Record<string, string | undefined>)[VERSION_KEY[v]];
        return a && a.toLowerCase() !== ZERO_ADDRESS;
      }
    );
    throw new Error(
      `Lagoon ${version} is not deployed on chain ${chainId}. Available: ${available.join(", ") || "none"}`
    );
  }

  return addr as Address;
}

export function isSupportedChainId(
  chainId: number
): chainId is SupportedChainId {
  return chainId in addresses;
}

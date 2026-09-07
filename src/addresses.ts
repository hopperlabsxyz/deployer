import { addresses as sdkAddresses } from "@lagoon-protocol/v0-core";
import type { Address } from "viem";

export type LagoonVersion = "v0.4.0" | "v0.5.0" | "v0.6.0";

/** EIP-155 id for Robinhood Chain. Not yet in `@lagoon-protocol/v0-core` ChainId. */
export const ROBINHOOD_CHAIN_ID = 4663;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Local overlays for chains the SDK does not yet ship. SDK entries win on conflict
// so this becomes a no-op once v0-core publishes the same chain id.
const LOCAL_ADDRESSES = {
  [ROBINHOOD_CHAIN_ID]: {
    optinFactory: "0x1e17e7848b2F56F75b16550471F455071a9F955f",
    feeRegistry: "0xF29514C94Db6d5780f2B6372abAeB0f1f5460070",
    wrappedNative: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
    v0_6_0: "0xAAcb8fF09bF4cF3897F13e4b33d12001fb70579A",
    isOptinFactoryV3: true,
  },
} as const;

type SdkChainId = keyof typeof sdkAddresses;
export type SupportedChainId = SdkChainId | typeof ROBINHOOD_CHAIN_ID;

const VERSION_KEY: Record<LagoonVersion, "v0_4_0" | "v0_5_0" | "v0_6_0"> = {
  "v0.4.0": "v0_4_0",
  "v0.5.0": "v0_5_0",
  "v0.6.0": "v0_6_0",
};

function getChainAddresses(chainId: number) {
  const sdkEntry = (sdkAddresses as Record<number, unknown>)[chainId];
  if (sdkEntry) {
    return sdkEntry as (typeof sdkAddresses)[SdkChainId];
  }
  if (chainId === ROBINHOOD_CHAIN_ID) {
    return LOCAL_ADDRESSES[ROBINHOOD_CHAIN_ID];
  }
  return undefined;
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

  const versionAddrs = entry as unknown as Record<string, string | undefined>;
  const key = VERSION_KEY[version];
  const addr = versionAddrs[key];

  if (!addr || addr.toLowerCase() === ZERO_ADDRESS) {
    const available = (Object.keys(VERSION_KEY) as LagoonVersion[]).filter(
      (v) => {
        const a = versionAddrs[VERSION_KEY[v]];
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
  return chainId in sdkAddresses || chainId === ROBINHOOD_CHAIN_ID;
}

import {
  addresses,
  Version,
  type ChainId,
  type VersionOrLatest,
} from "@lagoon-protocol/v0-core";
import type { Address, Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export function generateRandomBytes32(): Hex {
  // Generate 32 random bytes
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  // Convert to hex string with '0x' prefix
  return ("0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as Hex;
}

export function loadAccount(): PrivateKeyAccount {
  if (
    typeof Bun.env.PRIVATE_KEY !== "string" ||
    Bun.env.PRIVATE_KEY.startsWith("0x") === false
  ) {
    throw new Error("PRIVATE_KEY not a `0x${string}`");
  }

  const privateKey = Bun.env.PRIVATE_KEY as Address;
  return privateKeyToAccount(privateKey);
}

export function assertValidChainId(
  chainId: number
): asserts chainId is keyof typeof addresses {
  if (!Object.keys(addresses).includes(`${chainId}`)) {
    throw new Error(`Chain id ${chainId} not supported`);
  }
}

export function assertVersionSupported(
  chainId: ChainId,
  version: string
): asserts version is VersionOrLatest {
  if (version === "latest") return;
  console.log(Object.values(Version));
  // if (!Object.values(Version).includes(version as Version)) throw new Error(`Version ${version} is not a valid version`);
  const chainAddresses: Record<string, boolean> = Object.values(
    addresses
  ).reduce((acc: Record<string, boolean>, chainData) => {
    Object.keys(chainData).forEach((key) => {
      // Matches v followed by digits, underscores, and dots (e.g., v0_5_0, v0.5.0)
      if (/^v\d+[._]\d+[._]\d+$/.test(key)) {
        acc[key] = true;
      }
    });
    return acc;
  }, {} as Record<string, boolean>);
  if (!chainAddresses[version])
    throw new Error(`Version ${version} not supported for chain id ${chainId}`);
}

import type { Address, Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { DEPLOYER_BY_CHAIN } from "./addresses";

export function generateRandomBytes32(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
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
): asserts chainId is keyof typeof DEPLOYER_BY_CHAIN {
  if (!(chainId in DEPLOYER_BY_CHAIN)) {
    throw new Error(`Chain id ${chainId} not supported`);
  }
}

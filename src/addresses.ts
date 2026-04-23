import type { Address } from "viem";

export type LagoonVersion = "v0.4.0" | "v0.5.0" | "v0.6.0";

/**
 * OptinProxyFactory address per chainId.
 * Source: https://docs.lagoon.finance/resources/networks-and-addresses
 */
export const DEPLOYER_BY_CHAIN: Record<number, Address> = {
  1: "0x8D6f5479B14348186faE9BC7E636e947c260f9B1", // Ethereum
  10: "0xA8E0684887b9475f8942DF6a89bEBa5B25219632", // Optimism
  130: "0x6FC0F2320483fa03FBFdF626DDbAE2CC4B112b51", // Unichain
  137: "0x0C0E287f6e4de685f4b44A5282A3ad4A29D05a91", // Polygon
  143: "0xcCdC4d06cA12A29C47D5d105fED59a6D07E9cf70", // Monad
  146: "0x6FC0F2320483fa03FBFdF626DDbAE2CC4B112b51", // Sonic
  239: "0x66Ab87A9282dF99E38C148114F815a9C073ECA8D", // Tac
  480: "0xC094C224ce0406BC338E00837B96aD2e265F7287", // Worldchain
  999: "0x90beB507A1BA7D64633540cbce615B574224CD84", // HyperEVM
  1329: "0xDa1d1De87C4D90A07a6462cCD9bE651a0d074362", // Sei
  5000: "0xc094c224ce0406bc338e00837b96ad2e265f7287", // Mantle
  8453: "0x6FC0F2320483fa03FBFdF626DDbAE2CC4B112b51", // Base
  9745: "0xF838E8Bd649fc6fBC48D44E9D87273c0519C45c9", // Plasma
  42161: "0x9De724B0efEe0FbA07FE21a16B9Bf9bBb5204Fb4", // Arbitrum
  43114: "0xC094C224ce0406BC338E00837B96aD2e265F7287", // Avalanche
  59144: "0x8D6f5479B14348186faE9BC7E636e947c260f9B1", // Linea
  747474: "0xC094C224ce0406BC338E00837B96aD2e265F7287", // Katana
};

/**
 * Vault implementation address per chainId and version (lowercased).
 * Source: @lagoon-protocol/v0-core addresses (sdk-v0 repo).
 */
export const IMPLEMENTATIONS_BY_CHAIN: Record<
  number,
  Partial<Record<LagoonVersion, Address>>
> = {
  1: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  10: {
    "v0.5.0": "0xbb2dcc67a94946400a605f2a97933471be8bc538",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  56: {
    "v0.5.0": "0x7175e7e5c246e2e5c8c54ede2ee0180e39fca879",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  130: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
  },
  137: {
    "v0.5.0": "0x50f30e712d535b796c8543012d0c05218b89c7d5",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  143: {
    "v0.5.0": "0x870dd43a868c35b036347c46042d97c7247eea15",
  },
  146: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  239: {
    "v0.5.0": "0x11652aead69716e1d5d132f3bf0848d2fd422b8a",
  },
  480: {
    "v0.5.0": "0x1d42dbdde553f4099691a25f712bbd8f2686e355",
    "v0.6.0": "0xfa74576133e64c84e24f3a8205c9c69a02053e1c",
  },
  999: {
    "v0.5.0": "0xc1d5f01a6491b97b94f3670aed4becb897293cf8",
  },
  1329: {
    "v0.5.0": "0x357f1c9754dffced7c2efe086d2114909538047d",
  },
  5000: {
    "v0.4.0": "0xa7260cee56b679ec05a736a7b603b8da8525dd69",
    "v0.5.0": "0xc81dd51239119db80d5a6e1b7347f3c3bc8674d9",
  },
  8453: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
    "v0.6.0": "0x9de724b0efee0fba07fe21a16b9bf9bbb5204fb4",
  },
  9745: {
    "v0.5.0": "0xa61faeb94249f08e05e7ed7502d6ec86297bc9e4",
  },
  42161: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
    "v0.6.0": "0xc2344a58e450ad30def780a6641c0a90f50b0dbd",
  },
  43111: {
    "v0.5.0": "0xe35901b2a7d8d38a0e49d9bc9de7f4f9df31cc6d",
    "v0.6.0": "0xfa032de1214fd89b465c306bf46f778318bde357",
  },
  43114: {
    "v0.5.0": "0x33f65c8d025b5418c7f8dd248c2ec1d31881d465",
  },
  59144: {
    "v0.4.0": "0xc094c224ce0406bc338e00837b96ad2e265f7287",
    "v0.5.0": "0xa3c233c61436008e05edde6adb3f81a410fa80c2",
    "v0.6.0": "0xff04a00cb539617ff2abbf23aee037a1c52bc5d5",
  },
  80094: {
    "v0.5.0": "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
  },
  747474: {
    "v0.5.0": "0x7fe0c16eaa18562f1e37e6f6b205fda70164e2fb",
  },
};

export function getDeployerAddress(chainId: number): Address {
  const addr = DEPLOYER_BY_CHAIN[chainId];
  if (!addr) throw new Error(`No OptinProxyFactory deployed on chain ${chainId}`);
  return addr;
}

export function getImplementationAddress(
  chainId: number,
  version: LagoonVersion
): Address {
  const perChain = IMPLEMENTATIONS_BY_CHAIN[chainId];
  if (!perChain)
    throw new Error(`Chain ${chainId} has no known Lagoon implementations`);
  const addr = perChain[version];
  if (!addr)
    throw new Error(
      `Lagoon ${version} is not deployed on chain ${chainId}. Available: ${Object.keys(perChain).join(", ")}`
    );
  return addr;
}

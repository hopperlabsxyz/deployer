import { addresses, ChainId, ChainUtils, Version, type VersionOrLatest } from "@lagoon-protocol/v0-core";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Address,
  type PrivateKeyAccount,
  type PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  base,
  avalanche,
  linea,
  mainnet,
  tac,
  katana,
  polygon,
  worldchain,
  arbitrum,
  optimism,
  unichain,
  sonic,
  berachain,
  mantle,
  bsc,
  plasma
} from "viem/chains";

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

export const account = loadAccount()

const hyperevm = defineChain({
  ...ChainUtils.CHAIN_METADATA[ChainId.HyperEVMMainnet],
  network: 'hyperevm',
  rpcUrls: {
    default: {
      http: ['https://hyperliquid.drpc.org'],
    },
    public: {
      http: ['https://hyperliquid.drpc.org'],
    },
  },
})

export const chains = {
  [ChainId.EthMainnet]: mainnet,
  [ChainId.BaseMainnet]: base,
  [ChainId.PolygonMainnet]: polygon,
  [ChainId.ArbitrumMainnet]: arbitrum,
  [ChainId.OptimismMainnet]: optimism,
  [ChainId.WorldChainMainnet]: worldchain,
  [ChainId.UnichainMainnet]: unichain,
  [ChainId.SonicMainnet]: sonic,
  [ChainId.BerachainMainnet]: berachain,
  [ChainId.MantleMainnet]: mantle,
  [ChainId.AvalancheMainnet]: avalanche,
  [ChainId.TacMainnet]: tac,
  [ChainId.KatanaMainnet]: katana,
  [ChainId.BscMainnet]: bsc,
  [ChainId.HyperEVMMainnet]: hyperevm,
  [ChainId.LineaMainnet]: linea,
  [ChainId.PlasmaMainnet]: plasma,
};

export const createChainClients = (chainId: ChainId, rpcUrl?: string) => {
  return {
    publicClient: createPublicClient({
      chain: chains[chainId],
      transport: http(rpcUrl),
    }) as PublicClient,
    walletClient: createWalletClient({
      chain: chains[chainId],
      transport: http(rpcUrl),
      account,
    }),
  }
};

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
  if (version === 'latest') return;
  console.log(Object.values(Version))
  // if (!Object.values(Version).includes(version as Version)) throw new Error(`Version ${version} is not a valid version`);
  const chainAddresses: Record<string, boolean> = Object.values(addresses).reduce(
    (acc: Record<string, boolean>, chainData) => {
      Object.keys(chainData).forEach(key => {
        // Matches v followed by digits, underscores, and dots (e.g., v0_5_0, v0.5.0)
        if (/^v\d+[._]\d+[._]\d+$/.test(key)) {
          acc[key] = true;
        }
      });
      return acc;
    },
    {} as Record<string, boolean>
  );
  if (!chainAddresses[version])
    throw new Error(`Version ${version} not supported for chain id ${chainId}`);
}

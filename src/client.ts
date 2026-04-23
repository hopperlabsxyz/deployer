import { ChainId, ChainUtils } from "@lagoon-protocol/v0-core";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type PublicClient,
} from "viem";
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
  plasma,
} from "viem/chains";
import { loadAccount } from "./utils";

export const account = loadAccount();

const hyperevm = defineChain({
  ...ChainUtils.CHAIN_METADATA[ChainId.HyperEVMMainnet],
  network: "hyperevm",
  rpcUrls: {
    default: {
      http: ["https://hyperliquid.drpc.org"],
    },
    public: {
      http: ["https://hyperliquid.drpc.org"],
    },
  },
});

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

// Alchemy subdomain per chain, for chains Alchemy supports.
// See https://docs.alchemy.com/reference/chain-apis-overview
const ALCHEMY_SUBDOMAIN: Partial<Record<number, string>> = {
  [ChainId.EthMainnet]: "eth-mainnet",
  [ChainId.BaseMainnet]: "base-mainnet",
  [ChainId.PolygonMainnet]: "polygon-mainnet",
  [ChainId.ArbitrumMainnet]: "arb-mainnet",
  [ChainId.OptimismMainnet]: "opt-mainnet",
  [ChainId.WorldChainMainnet]: "worldchain-mainnet",
  [ChainId.UnichainMainnet]: "unichain-mainnet",
  [ChainId.SonicMainnet]: "sonic-mainnet",
  [ChainId.BerachainMainnet]: "berachain-mainnet",
  [ChainId.MantleMainnet]: "mantle-mainnet",
  [ChainId.AvalancheMainnet]: "avax-mainnet",
  [ChainId.BscMainnet]: "bnb-mainnet",
  [ChainId.LineaMainnet]: "linea-mainnet",
};

function resolveRpcUrl(chainId: number, override?: string): string | undefined {
  if (override) return override;
  // Per-chain override: RPC_URL_<chainId> in .env (highest priority after argument)
  const envUrl = Bun.env[`RPC_URL_${chainId}`];
  if (envUrl) return envUrl;
  const key = Bun.env.ALCHEMY_API_KEY;
  const subdomain = ALCHEMY_SUBDOMAIN[chainId];
  if (key && subdomain) return `https://${subdomain}.g.alchemy.com/v2/${key}`;
  return undefined; // fall back to viem's default public RPC
}

export const createChainClients = (chainId: ChainId, rpcUrl?: string) => {
  const url = resolveRpcUrl(chainId, rpcUrl);
  return {
    publicClient: createPublicClient({
      chain: chains[chainId],
      transport: http(url),
    }) as PublicClient,
    walletClient: createWalletClient({
      chain: chains[chainId],
      transport: http(url),
      account,
    }),
  };
};

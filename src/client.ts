import {
  addresses,
  ChainId,
  ChainUtils,
  Version,
  type VersionOrLatest,
} from "@lagoon-protocol/v0-core";
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
  };
};

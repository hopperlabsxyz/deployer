import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalanche, linea, mainnet, tac } from "viem/chains";

if (
  typeof Bun.env.PRIVATE_KEY !== "string" ||
  Bun.env.PRIVATE_KEY.startsWith("0x") === false
) {
  throw new Error("PRIVATE_KEY not a `0x${string}`");
}
const privateKey = Bun.env.PRIVATE_KEY as Address;

export const account = privateKeyToAccount(privateKey);

export const katana = defineChain({
  id: 747474,
  name: "Katana",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.katana.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Katanascan",
      url: "https://katanascan.com/",
      apiUrl: "https://katanascan.com/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 0,
    },
  },
});

export const katanaClient = createWalletClient({
  chain: katana,
  transport: http(),
  account,
});

export const clients = {
  [mainnet.id]: {
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http(),
    }),
    walletClient: createWalletClient({
      chain: mainnet,
      transport: http(),
      account,
    }),
  },
  [tac.id]: {
    publicClient: createPublicClient({
      chain: tac,
      transport: http("https://rpc.ankr.com/tac"),
    }),
    walletClient: createWalletClient({
      chain: tac,
      transport: http("https://rpc.ankr.com/tac"),
      account,
    }),
  },
  [linea.id]: {
    publicClient: createPublicClient({
      chain: linea,
      transport: http("https://rpc.linea.build"),
    }),
    walletClient: createWalletClient({
      chain: linea,
      transport: http("https://rpc.linea.build"),
      account,
    }),
  },
  [katana.id]: {
    publicClient: createPublicClient({
      chain: katana,
      transport: http("https://rpc.katana.network"),
    }),
    walletClient: createWalletClient({
      chain: katana,
      transport: http("https://rpc.katana.network"),
      account,
    }),
  },
  [avalanche.id]: {
    publicClient: createPublicClient({
      chain: avalanche,
      transport: http("https://avalanche.drpc.org"),
    }),
    walletClient: createWalletClient({
      chain: avalanche,
      transport: http("https://avalanche.drpc.org"),
      account,
    }),
  },
} as const;

export function assertValidChainId(
  chainId: number
): asserts chainId is keyof typeof clients {
  if (!Object.keys(clients).includes(`${chainId}`)) {
    throw new Error(`Chain id ${chainId} not supported`);
  }
}

import { fetchSymbol, Vault } from "@lagoon-protocol/v0-viem"
import { type Address, type PublicClient } from "viem";
import { assertValidChainId, clients, katana } from "./client";


const addresses: Address[] = ["0x543E69C1f933004E9C2b8Da242588439A438dF70", "0x0413076d3319cb69077495de575173870a58e865", "0x7082a90fc622dc7364d30922e5803850e6bc0faa",
  "0x7add84c19d15111bf9dc43abf84aed82cf336742"
]

async function getInfo(address: Address, chainId: number) {
  assertValidChainId(chainId)
  const client = clients[chainId].publicClient
  const { name, symbol, asset, safe, valuationManager, feeReceiver } = await Vault.fetch(address, client)
  const underlyingSymbol = await fetchSymbol({ address: asset }, client)
  return {
    underlyingSymbol,
    name,
    symbol,
    chain: client.chain?.name,
    currationAddr: safe,
    safeLink: safe,
    feeReceiver: `https://app.safe.global/home?safe=eth:${feeReceiver}`,
    nav: valuationManager,
    vaultAddr: address,
    url: `https://app.lagoon.finance/vault/${client.chain?.id}/${address}`,
  }
}

const infos = await Promise.all(addresses.map((address: Address) => getInfo(address, katana.id)))

const headers = ['underlyingSymbol', 'name', 'symbol', 'chain', 'currationAddr', 'safeLink', 'feeReceiver', 'nav', 'vaultAddr', 'url']

// Build CSV string
const csv = [
  headers.join(','), // header
  ...infos.map(item =>
    headers.map(key => JSON.stringify((item as any)[key as any])).join(',')
  )
].join('\n')

await Bun.write('output.csv', csv)

console.log(csv)

// ABI for protocol-v3 OptinProxyFactory.
// Only the functions the deployer script uses are included.
// Source: lagoon-v0-internal/src/protocol-v3/OptinProxyFactory.sol
export default [
  {
    type: "function",
    name: "createVaultProxy",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_logic", type: "address" },
      { name: "_initialOwner", type: "address" },
      { name: "_initialDelay", type: "uint256" },
      { name: "call_data", type: "bytes" },
      { name: "salt", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "registry",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "wrappedNativeToken",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "isInstance",
    stateMutability: "view",
    inputs: [{ name: "vault", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "ProxyDeployed",
    anonymous: false,
    inputs: [
      { name: "proxy", type: "address", indexed: false },
      { name: "deployer", type: "address", indexed: false },
    ],
  },
] as const;

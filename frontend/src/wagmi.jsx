import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
})

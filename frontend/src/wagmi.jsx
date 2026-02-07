import { http, createConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    injected(),
  ],
  transports: {
    [hardhat.id]: http(),
  },
})

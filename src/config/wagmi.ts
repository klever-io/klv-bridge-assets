import { http, createConfig } from "wagmi";
import { mainnet, polygon, bsc, arbitrum } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, polygon, bsc, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

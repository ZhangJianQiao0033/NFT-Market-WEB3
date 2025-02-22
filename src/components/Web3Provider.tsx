"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";
import { type Chain } from "viem";

export const ganacheLocal = {
  id: 1337, // Ganache 默认链ID
  name: "Ganache Local",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["http://localhost:7545"] }, // Ganache 默认 RPC URL
  },
  blockExplorers: {
    default: { name: "Ganache Explorer", url: "http://localhost:7545" }, // 本地浏览器
  },
  contracts: {
    multicall3: {
      address: "0x620A1cA17cb8CfBc15C7AdE0D5CD56bd90435592",
      blockCreated: 14353601,
    },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "nft-market",
  projectId: "7fa9f46412ab2d5865ed45dbf39e5b54",
  chains: [mainnet, polygon, optimism, arbitrum, base, ganacheLocal],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme(); // 获取当前的主题

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={
            theme === "dark"
              ? darkTheme({
                  accentColor:
                    "linear-gradient(101.12deg, #eb1484 27.35%, #c91cc3 99.99%, #c81cc5 100%, #c81cc5 100%)",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "rounded",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor:
                    "linear-gradient(101.12deg, #eb1484 27.35%, #c91cc3 99.99%, #c81cc5 100%, #c81cc5 100%)",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "rounded",
                  overlayBlur: "small",
                })
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;

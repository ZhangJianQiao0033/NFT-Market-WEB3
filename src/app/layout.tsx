import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Web3PRovider, Footer, NavBar, ThemeProvider } from "@/components";
import Script from "next/script";
import NFTProvider from "@/context/NFTProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deep_NFT",
  description: "Explore and create unique NFTs with DeepNFT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://kit.fontawesome.com/b936da62e4.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3PRovider>
            <NFTProvider>
              <div className="dark:bg-nft-dark bg-white min-h-screen">
                <NavBar />
                <div className="pt-20">{children}</div>
                <Footer />
              </div>
            </NFTProvider>
          </Web3PRovider>
        </ThemeProvider>
      </body>
    </html>
  );
}

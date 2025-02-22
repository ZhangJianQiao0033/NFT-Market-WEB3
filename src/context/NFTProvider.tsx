"use client";
import * as dotenv from "dotenv";
dotenv.config();
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Contract, ethers, parseEther, Provider, Signer } from "ethers";
import { MarketAddress, MarketAddressABI } from "./constans";
import { useRouter } from "next/navigation";
import axios from "axios";

interface NFTContextType {
  nftCurrency: string;
  address: `0x${string}` | undefined;
  createSale?: any;
  fetchNFTs: any;
  fetchMyNFTsOrCreatedNFTs: any;
  isLoadingNFT: boolean;
  buyNft: any;
}
const NFTContextDefaultValue = {
  nftCurrency: "ETH",
  address: undefined,
  createSale: null,
  fetchNFTs: null,
  fetchMyNFTsOrCreatedNFTs: null,
  isLoadingNFT: false,
  buyNft: null,
};
export const NFTContext = createContext<NFTContextType>(NFTContextDefaultValue);
const nftCurrency = "ETH";
const HOLESKY_RPC = process.env.NEXT_PUBLIC_HOLESKY_RPC

const fetchContract = (signerOrProvider: Signer | Provider) => {
  return new Contract(MarketAddress, MarketAddressABI, signerOrProvider);
};

const NFTProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();

  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const router = useRouter();

  const createSale = async (
    url: string,
    formInputPrice: string,
    isReselling?: boolean,
    id?: string
  ) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const price = parseEther(formInputPrice);
    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();
    console.log("listingPrice", typeof listingPrice, listingPrice);
    const transaction = !isReselling
      ? await contract.createToken(url, price, {
          value: listingPrice.toString(),
        })
      : await contract.resellToken(id, price, {
          value: listingPrice.toString(),
        });

    setIsLoadingNFT(true);
    await transaction.wait();
    router.push("/");
  };
  interface IItem {
    tokenId: any;
    seller: any;
    owner: any;
    price: any;
  }

  // 添加网络检查和切换逻辑
  useEffect(() => {
    const checkAndSwitchNetwork = async () => {
      if (!window.ethereum) {
        alert("请安装 MetaMask 或其他支持的钱包扩展");
        return;
      }

      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0x4268") {
          // 尝试切换到 Holesky 网络
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4268" }],
          });
        }
      } catch (switchError: any) {
        // 如果 Holesky 网络未添加到钱包（错误代码 4902），提示用户添加
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x4268",
                  chainName: "Holesky Testnet",
                  rpcUrls: ["https://rpc.holesky.ethpandaops.io"], // 建议替换为更可靠的 RPC，如 Alchemy 或 Infura
                  nativeCurrency: {
                    name: "Holesky ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://holesky.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            alert("添加 Holesky 网络失败，请手动添加（链 ID: 17000）");
            console.error(addError);
          }
        } else {
          alert("切换网络失败，请确保钱包已连接并手动切换到 Holesky 网络");
          console.error(switchError);
        }
      }
    };
    checkAndSwitchNetwork();
  }, [address]);

  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.JsonRpcProvider(HOLESKY_RPC);
    // const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(
        async ({ tokenId, seller, owner, price: unformattedPrice }: IItem) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.formatEther(unformattedPrice.toString());
          console.log("tokenId:", tokenId, "typeof tokenId:", typeof tokenId);
          return {
            price,
            tokenId: Number(tokenId),
            id: Number(tokenId),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );

    return items;
  };

  const fetchMyNFTsOrCreatedNFTs = async (type: string) => {
    setIsLoadingNFT(false);

    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = fetchContract(signer);
    const data =
      type === "fetchItemsListed"
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(
        async ({ tokenId, seller, owner, price: unformattedPrice }: IItem) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.formatEther(unformattedPrice.toString());

          return {
            price,
            tokenId: Number(tokenId),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );

    return items;
  };

  const buyNft = async (nft: any) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      MarketAddress,
      MarketAddressABI,
      signer
    );
    const price = parseEther(nft.price.toString());

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };
  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        address,
        createSale,
        fetchNFTs,
        fetchMyNFTsOrCreatedNFTs,
        isLoadingNFT,
        buyNft,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTProvider;

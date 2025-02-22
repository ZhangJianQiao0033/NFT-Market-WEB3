"use client";
import { useContext, useEffect, useRef, useState } from "react";

import { Banner, CreatorCard, NFTCard, SearchBar } from "@/components";
import images from "../../public/assets";
import { makeId } from "@/utils/makeId";
import Image, { StaticImageData } from "next/image";
import { useTheme } from "next-themes";
import { NFTContext } from "@/context/NFTProvider";
import { getCreators } from "@/utils/getCreators";
import { shortenAddress } from "@/utils/shortenAddress";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [hideButtons, setHideButtons] = useState(false);
  const { theme } = useTheme();
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState<any[]>([]);
  const [activeSelect, setActiveSelect] = useState("Recently Added");
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNFTs().then((items: any) => {
      setNfts((items.reverse()));
      setNftsCopy(items);
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case "Price (low to high)":
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case "Price (high to low)":
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case "Recently added":
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value:any) => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNfts.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const handleScroll = (direction: string) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (current) {
      // 空值检查，确保 current 不是 null
      if (direction === "left") {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };
  // check if scrollRef container is overfilling its parentRef container
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current && parent) {
      if (current.scrollWidth >= parent.offsetWidth) {
        return setHideButtons(false);
      }
    }

    setHideButtons(true);
  };

  // if window is resized
  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);

    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  });
  const creators = getCreators(nfts);
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={
            <>
              Discover, collect, and sell <br /> extraordinary NFTs
            </>
          }
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        <div>
          <h1
            className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl
  font-semibold ml-4 xs:ml-0"
          >
            Top Sellers
          </h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}
            >
              {creators.map((creator, i) => (
                <CreatorCard
                  key={creator.seller}
                  rank={i + 1}
                  creatorImage={(images as any)[`creator${i + 1}`]}
                  creatorName={shortenAddress(creator.seller)}
                  creatorEths={creator.sumall}
                />
              ))}
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}` as keyof typeof images]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - i * 0.5}
                />
              ))}

              {!hideButtons && (
                <>
                  <div
                    onClick={() => handleScroll("left")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                  >
                    <Image
                      src={images.left}
                      fill
                      style={{ objectFit: "contain" }}
                      alt="left_arrow"
                      className={theme === "light" ? "filter invert" : ""}
                      sizes="(max-width: 768px) 32px, 48px"
                    />
                  </div>
                  <div
                    onClick={() => handleScroll("right")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                  >
                    <Image
                      src={images.right}
                      fill
                      style={{ objectFit: "contain" }}
                      alt="right_arrow"
                      className={theme === "light" ? "filter invert" : ""}
                      sizes="(max-width: 768px) 32px, 48px"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* NTF Birds */}
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 before:first:font-poppins dark:text-white □text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
              Hot NFTs
            </h1>
            <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  price: (10 - i * 0.534).toFixed(2),
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: "Cool NFT on Sale",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

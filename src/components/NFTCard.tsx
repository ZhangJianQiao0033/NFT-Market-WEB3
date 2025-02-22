"use client";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/assets";
import { NFTContext } from "../context/NFTProvider";
import { shortenAddress } from "../utils/shortenAddress";

const NFTCard = ({
  nft,
  onProfilePage,
}: {
  nft: any;
  onProfilePage?: boolean;
}) => {
  const { nftCurrency } = useContext(NFTContext);

  return (
    <Link href={{ pathname: "/nft-details", query: nft }}>
      <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
        <div className="relative w-full h-52 sm:h-36  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          <Image
            src={nft.image || images[`nft${nft.i}` as keyof typeof images]}
            fill
            style={{ objectFit: "cover" }}
            alt="nft01"
            sizes="(max-width: 640px) 155px, (max-width: 768px) 215px, (max-width: 1024px) 256px, 327px"
          />
        </div>
        <div className="mt-3 flex flex-col">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {nft.name}
          </p>
          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">
              {nft.price}
              <span className="font-normal"> {nftCurrency}</span>
            </p>
            <p className="font-poppins dark:text-white □text-nft-black-1 font-semibold text-xs minlg:text-lg">
              {shortenAddress(onProfilePage ? nft.owner : nft.seller)}
            </p>
          </div>
          <div className="mt-1 minlg:mt-3 flexBetween flex-row" />
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;

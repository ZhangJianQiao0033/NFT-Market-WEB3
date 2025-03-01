import { useContext } from "react";
import Image from "next/image";
import images from "../../public/assets";
// import { NFTContext } from '../context/NFTContext';

interface ICreatorCard {
  rank: any;
  creatorImage: any;
  creatorName: string;
  creatorEths: any;
}

const CreatorCard = ({
  rank,
  creatorImage,
  creatorName,
  creatorEths,
}: ICreatorCard) => {
  // const { nftCurrency } = useContext(NFTContext);

  return (
    <div className="min-w-190 minlg:min-w-240 dark:bg-nft-black-3 bg-white border dark:border-nft-black-3 border-nft-gray-1 rounded-3xl flex flex-col p-4 m-4">
      <div className="w-8 h-8 minlg:w-10 minlg:h-10 rounded-full bg-nft-red-violet flexCenter">
        <p className="font-poppins text-white font-semibold text-base minlg:text-lg ">
          {rank}
        </p>
      </div>

      <div className="my-2 flex justify-center">
        <div className="relative w-20 h-20 minlg:w-28 minlg:h-28">
          <Image
            src={creatorImage}
            fill
            style={{ objectFit: "cover" }}
            alt="creator"
            className="rounded-full"
            sizes="(max-width: 600px) 25vw, (max-width: 1024px) 15vw, 10vw" // Added sizes property for better performance
          />
          <div className="absolute w-4 h-4 minlg:w-7 minlg:h-7 bottom-2 -right-0">
            <Image
              src={images.tick}
              fill
              style={{ objectFit: "contain" }}
              alt="tick"
              sizes="(max-width: 600px) 10vw, (max-width: 1024px) 8vw, 5vw" // Adjusted for tick icon
            />
          </div>
        </div>
      </div>

      <div className="mt-3 minlg:mt-7 text-center flexCenter flex-col">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">
          {creatorName}
        </p>
        <p className="mt-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-base">
          {creatorEths.toFixed(2)} <span className="font-normal">ETH</span>
          {/* <span className="font-normal">{nftCurrency}</span> */}
        </p>
      </div>
    </div>
  );
};

export default CreatorCard;

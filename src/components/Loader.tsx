import Image from "next/image";

import images from "../../public/assets";

const Loader = () => (
  <div className="flexCenter w-full my-4">
    <Image
      src={images.loader}
      alt="loader"
      width={100}
      style={{ objectFit: "contain" }}
      priority
    />
  </div>
);

export default Loader;

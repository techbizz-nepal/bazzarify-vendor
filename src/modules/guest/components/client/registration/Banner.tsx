import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

const Banner = ({ children }: { children: ReactNode }) => {
  const bannerLastLineRef = useRef<HTMLParagraphElement | null>(null);
  const [lastLineBounds, setLastLineBounds] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  useEffect(() => {
    if (bannerLastLineRef.current) {
      const bounds = bannerLastLineRef.current.getBoundingClientRect();
      setLastLineBounds(bounds);
    }
  }, []);
  return (
    <div className="bg-primary">
      <div className="flex flex-row items-center px-3 py-2 md:justify-between md:px-24 md:py-10">
        <div className="hidden w-1/2 md:block md:w-7/12">
          <div
            className="leading-tight font-normal text-white"
            style={{ fontSize: "2.3rem" }}
          >
            <p>Grow your business online, reach more</p>
            <p>customers, and sell effortlessly with</p>
            <p className="inline" ref={bannerLastLineRef}>
              Bazzarify Vendor!
            </p>
          </div>
          <div
            className="relative"
            style={{
              left: lastLineBounds.width - 50,
              top: -100,
              height: "50vh",
              width: "35vw",
            }}
          >
            <Image
              src="/scooter.png"
              alt="logo"
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div
          className="z-10 flex w-full flex-col space-y-5 rounded-lg bg-white p-4 md:w-5/12"
          id="registrationForm"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default Banner;

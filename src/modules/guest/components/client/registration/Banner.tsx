import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";

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
      <div className="flex flex-row md:justify-between px-3 py-2 md:px-24 md:py-10 items-center">
        <div className="hidden md:block w-1/2 md:w-7/12">
          <div
            className="font-normal text-white leading-tight"
            style={{ fontSize: "2.8rem" }}
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
              left: lastLineBounds.width - 80,
              top: -120,
              height: "50vh",
              width: "35vw",
            }}
          >
            {bannerLastLineRef.current && (
              <Image
                src="/scooter.png"
                alt="logo"
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>
        <div
          className="w-full md:w-5/12 bg-white p-4 rounded-lg flex flex-col space-y-5 z-10"
          id="registrationForm"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default Banner;

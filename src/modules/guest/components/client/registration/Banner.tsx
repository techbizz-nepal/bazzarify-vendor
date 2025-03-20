import { ReactNode } from "react";
import Image from "next/image";

const Banner = ({ children }: { children: ReactNode }) => (
  <div className="bg-primary">
    <div className="flex flex-row md:justify-between px-3 py-2 md:px-24 md:py-10 items-center">
      <div className="hidden md:block w-1/2 md:w-7/12">
        <p className="text-5xl font-normal  text-white leading-tight">
          Grow your business online, reach more customers, and sell effortlessly
          with Bazzarify Vendor!
        </p>
        <div className="relative -top-30 left-85">
          <Image src="/scooter.png" alt="logo" width={600} height={250} />
        </div>
      </div>
      <div
        className="w-full md:w-5/12 bg-white p-4 rounded-lg flex flex-col space-y-5 z-20"
        id="registrationForm"
      >
        {children}
      </div>
    </div>
  </div>
);
export default Banner;

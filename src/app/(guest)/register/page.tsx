import { Metadata } from "next";
import VendorRegistrationForm from "@/modules/guest/components/client/VendorRegistrationForm";
import Header from "@/modules/guest/components/client/registration/Header";
import WhySellOnBazzarify from "@/modules/guest/components/client/registration/WhySellOnBazzarify";
import NewsLetterBanner from "@/modules/core/components/server/NewsletterBanner";
import Image from "next/image";
import { categoriesData, footerData } from "@/modules/core/data";
import { PiDotOutlineBold, PiMapPinLineLight } from "react-icons/pi";
import { LuHeadphones, LuMail } from "react-icons/lu";
import { FaBusinessTime } from "react-icons/fa";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account",
};

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <main className="w-full flex-col py-2 ">
        <Header />
        <VendorRegistrationForm />
        <div className="py-8">
          <WhySellOnBazzarify />
        </div>
        <NewsLetterBanner />
      </main>
      <Footer />
    </Suspense>
  );
}

const Footer = () => (
  <footer className="flex flex-col space-y-7 ">
    <div className="px-24">
      <div className="grid grid-cols-5 gap-4">
        <div className="flex flex-col space-y-5">
          <div>
            <Image
              src="/logo.png"
              alt="logo"
              width={150}
              height={20}
              className="hidden md:block w-auto h-auto"
              priority={true}
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <PiMapPinLineLight size={16} />
            {footerData.contactDetails.address}
          </div>
          <div className="flex gap-x-4 items-center">
            <LuHeadphones size={16} />
            {footerData.contactDetails.contact}
          </div>
          <div className="flex gap-x-4 items-center">
            <LuMail size={16} />
            {footerData.contactDetails.email}
          </div>
          <div className="flex gap-x-4 items-center">
            <FaBusinessTime size={16} />
            {footerData.contactDetails.openingTime}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="p-3">
            <p className="text-2xl font-semibold">Information</p>
          </div>
          <div className="flex flex-col space-y-2">
            {footerData.menu.Information.map((item) => (
              <div
                key={item.id}
                className="flex flex-row space-x-1 items-center"
              >
                <PiDotOutlineBold size={32} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="p-3">
            <p className="text-2xl font-semibold">Account</p>
          </div>
          <div className="flex flex-col space-y-2">
            {footerData.menu.Account.map((item) => (
              <div
                key={item.id}
                className="flex flex-row space-x-1 items-center"
              >
                <PiDotOutlineBold size={32} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="p-3">
            <p className="text-2xl font-semibold">Services</p>
          </div>
          <div className="flex flex-col space-y-2">
            {footerData.menu.Services.map((item) => (
              <div
                key={item.id}
                className="flex flex-row space-x-1 items-center"
              >
                <PiDotOutlineBold size={32} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="p-3">
            <p className="text-2xl font-semibold">Download App</p>
          </div>
          <div>
            <Image
              src="/google-play-badge.png"
              alt="download-bazzarify"
              width={200}
              height={150}
            />
          </div>
          <div className="px-3">
            <Image
              src="/apple-store-badge.png"
              alt="download-bazzarify"
              width={175}
              height={100}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row space-x-8 flex-wrap items-center justify-center px-64 py-8">
        {categoriesData.map((item) => (
          <div
            className="flex-row flex text-lg font-semibold cursor-pointer"
            key={item}
          >
            <p className="leading-8">{item}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full ">
      <Image
        src="/payment-banner.png"
        alt="payment-banner"
        width={2048}
        height={50}
      />
    </div>
    <div className="flex flex-row bg-sidebar-primary h-14 items-center px-24">
      <div className="text-primary-foreground ">
        <p>
          &copy; {new Date().getFullYear()} bazzarify.com, All right reversed.
        </p>
      </div>
    </div>
  </footer>
);

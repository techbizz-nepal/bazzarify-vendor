import NewsLetterBanner from "@/modules/core/components/server/NewsletterBanner";
import { categoriesData, footerData } from "@/modules/core/data";
import VendorRegistrationForm from "@/modules/guest/components/client/VendorRegistrationForm";
import Header from "@/modules/guest/components/client/registration/Header";
import WhySellOnBazzarify from "@/modules/guest/components/client/registration/WhySellOnBazzarify";
import { Loader } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { FaBusinessTime } from "react-icons/fa";
import { LuHeadphones, LuMail } from "react-icons/lu";
import { PiDotOutlineBold, PiMapPinLineLight } from "react-icons/pi";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account",
};

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <main className="w-full flex-col py-2">
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
  <footer className="flex flex-col space-y-7">
    <div className="px-24">
      <div className="grid grid-cols-5 gap-4">
        <div className="flex flex-col space-y-5">
          <div>
            <Image
              src="/logo.png"
              alt="logo"
              width={150}
              height={20}
              className="hidden h-auto w-auto md:block"
              priority={true}
            />
          </div>
          <div className="flex items-center gap-x-4">
            <PiMapPinLineLight size={16} />
            {footerData.contactDetails.address}
          </div>
          <div className="flex items-center gap-x-4">
            <LuHeadphones size={16} />
            {footerData.contactDetails.contact}
          </div>
          <div className="flex items-center gap-x-4">
            <LuMail size={16} />
            {footerData.contactDetails.email}
          </div>
          <div className="flex items-center gap-x-4">
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
                className="flex flex-row items-center space-x-1"
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
                className="flex flex-row items-center space-x-1"
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
                className="flex flex-row items-center space-x-1"
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
      <div className="flex w-full flex-row flex-wrap items-center justify-center space-x-8 px-64 py-8">
        {categoriesData.map((item) => (
          <div
            className="flex cursor-pointer flex-row text-lg font-semibold"
            key={item}
          >
            <p className="leading-8">{item}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full">
      <Image
        src="/payment-banner.png"
        alt="payment-banner"
        width={2048}
        height={50}
      />
    </div>
    <div className="bg-sidebar-primary flex h-14 flex-row items-center px-24">
      <div className="text-primary-foreground">
        <p>
          &copy; {new Date().getFullYear()} bazzarify.com, All right reversed.
        </p>
      </div>
    </div>
  </footer>
);

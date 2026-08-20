"use client";
import { Input } from "@/components/ui/input";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";

const NewsLetterBanner = () => {
  return (
    <div className="bg-sidebar-primary w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 px-24 items-center gap-10">
        <div className="flex items-center space-x-3">
          <div>
            <FaPaperPlane size={52} className="text-primary" />
          </div>
          <div className="w-full flex-col md:flex-row justify-around items-center space-y-2 text-center">
            <p className="text-2xl font-semibold">Signup for Newsletter</p>
            <p className="text-sm font-normal">
              We’ll never share your email address with a third-party.
            </p>
          </div>
        </div>
        <div className="flex w-full">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded-l-lg rounded-r-none bg-white"
          />
          <ThemedButton type="submit" className="rounded-l-none">
            Subscribe
          </ThemedButton>
        </div>
        <div className="flex justify-center md:justify-end space-x-4">
          <FaLinkedin size={32} />
          <FaTwitter size={32} />
          <FaInstagram size={32} />
          <FaPinterest size={32} />
          <FaFacebookF size={32} />
        </div>
      </div>
    </div>
  );
};
export default NewsLetterBanner;

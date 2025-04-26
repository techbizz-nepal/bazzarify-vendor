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
      <div className="flex h-full items-center space-x-28 px-24">
        <div className="flex w-4/12 items-center justify-center space-x-6">
          <div>
            <FaPaperPlane size={52} className="text-primary" />
          </div>
          <div className="flex-col space-y-2">
            <p className="text-primary-foreground text-2xl font-semibold">
              Signup for Newsletter
            </p>
            <p className="text-primary-foreground text-sm font-normal">
              We’ll never share your email address with a third-party.
            </p>
          </div>
        </div>
        <div className="flex w-4/12 items-center justify-center">
          <Input
            type="email"
            placeholder="Email"
            className="rounded-l-lg rounded-r-none bg-white"
          />
          <ThemedButton type="submit" className="rounded-l-none">
            Subscribe
          </ThemedButton>
        </div>
        <div className="flex w-4/12 items-center justify-center space-x-5">
          <div>
            <FaLinkedin className="text-primary-foreground" size={32} />
          </div>
          <div>
            <FaTwitter className="text-primary-foreground" size={32} />
          </div>
          <div>
            <FaInstagram className="text-primary-foreground" size={32} />
          </div>
          <div>
            <FaPinterest className="text-primary-foreground" size={32} />
          </div>
          <div>
            <FaFacebookF className="text-primary-foreground" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewsLetterBanner;

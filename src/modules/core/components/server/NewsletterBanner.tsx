import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

const NewsLetterBanner = () => {
  return (
    <div className="w-full py-10 bg-sidebar-primary">
      <div className="px-24 flex space-x-28 items-center h-full">
        <div className="w-4/12 flex space-x-6 items-center justify-center">
          <div>
            <FaPaperPlane size={52} className="text-primary" />
          </div>
          <div className="flex-col space-y-2">
            <p className="text-primary-foreground font-semibold text-2xl">
              Signup for Newsletter
            </p>
            <p className="text-primary-foreground font-normal text-sm">
              We’ll never share your email address with a third-party.
            </p>
          </div>
        </div>
        <div className="w-4/12 flex items-center justify-center ">
          <Input
            type="email"
            placeholder="Email"
            className="bg-white rounded-r-none rounded-l-lg"
          />
          <ThemedButton type="submit" className="rounded-l-none">
            Subscribe
          </ThemedButton>
        </div>
        <div className="w-4/12 flex space-x-5 items-center justify-center">
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

import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <div className="flex flex-row justify-center md:justify-between px-3 md:px-24 py-4 items-center">
    <Image
      src="/logo.png"
      alt="logo"
      width={250}
      height={68}
      className="hidden md:block w-auto h-auto"
      priority={true}
    />
    <Link
      className="h-14 rounded-md px-8 has-[>svg]:px-4 bg-primary items-center flex justify-center text-primary-foreground text-2xl hover:animate-pulse"
      target={"_blank"}
      href="https://play.google.com/apps/testing/com.techbizz.bazzarify"
    >
      Get App
    </Link>
  </div>
);
export default Header;

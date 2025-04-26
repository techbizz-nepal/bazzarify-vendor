import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <div className="sticky top-0 z-20 flex flex-row items-center justify-center bg-white px-3 py-4 shadow md:justify-between md:px-24">
    <Image
      src="/logo.png"
      alt="logo"
      width={250}
      height={68}
      className="hidden h-auto w-auto md:block"
      priority={true}
    />
    <Link
      className="bg-primary text-primary-foreground flex h-14 items-center justify-center rounded-md px-8 text-2xl hover:animate-pulse has-[>svg]:px-4"
      target={"_blank"}
      href="https://play.google.com/store/apps/details?id=com.techbizz.bazzarify"
    >
      Get App
    </Link>
  </div>
);
export default Header;

import Image from "next/image";
import { Button } from "@/components/ui/button";

const Header = () => (
  <div className="flex flex-row justify-center md:justify-between px-3 md:px-24 py-4 items-center">
    <Image
      src="/logo.png"
      alt="logo"
      width={250}
      height={68}
      className="hidden md:block"
    />
    <Button className="h-14 rounded-md px-8 has-[>svg]:px-4">
      <p className="text-2xl">Get App</p>
    </Button>
  </div>
);
export default Header;

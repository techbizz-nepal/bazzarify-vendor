"use client";

import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const Breadcrumb = () => {
  const pathname = usePathname();
  return (
    <div
      className={cn(`flex`, `items-center`, `space-x-1`, `text-primary`)}
      id="breadcrumbs"
    >
      {pathname.split("/").map((path, index) =>
        index === 0 ? (
          <Link href="/" key={path}>
            <FaHome size="20" />
          </Link>
        ) : index === 1 ? (
          <span className="flex items-center space-x-2" key={path}>
            <FaAngleRight size={20} />
            <Link href={"/".concat(path)}>{path}</Link>
          </span>
        ) : (
          <span className="flex items-center" key={path}>
            <FaAngleRight size={20} />
            {path}
          </span>
        ),
      )}
    </div>
  );
};

export default Breadcrumb;

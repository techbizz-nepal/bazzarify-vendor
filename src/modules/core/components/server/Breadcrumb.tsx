"use client";

import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const getHref = (index: number) => "/" + paths.slice(0, index + 1).join("/");

  return (
    <div
      className={cn("flex items-center text-primary space-x-2")}
      id="breadcrumbs"
    >
      <Link href="/" className="flex items-center space-x-2 text-md">
        <FaHome size={20} />
      </Link>

      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        return (
          <div className="flex items-center space-x-2 text-md" key={index}>
            <FaAngleRight size={14} />
            {isLast ? (
              <span>{path}</span>
            ) : (
              <Link href={getHref(index)}>{path}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;

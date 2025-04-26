"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const getHref = (index: number) => "/" + paths.slice(0, index + 1).join("/");

  return (
    <div
      className={cn("text-primary flex items-center space-x-2")}
      id="breadcrumbs"
    >
      <Link href="/" className="text-md flex items-center space-x-2">
        <FaHome size={20} />
      </Link>

      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        return (
          <div className="text-md flex items-center space-x-2" key={index}>
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

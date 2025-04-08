"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { cn } from "@/lib/utils";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export default function CategoryDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  useEffect(() => {
    if (showDropdown) {
      console.log("opened");
    }
  }, [showDropdown]);

  return (
    <DropdownMenu onOpenChange={setShowDropdown} open={showDropdown}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "items-center justify-between",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          )}
        >
          <p className="text-gray-500">here</p>
          <div>
            {showDropdown ? (
              <FaAngleDown className="text-gray-500" />
            ) : (
              <FaAngleUp className="text-gray-500" />
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex-col border border-gray-400 space-y-2 p-2 max-w-3xl w-full">
        {/*<div>*/}
        {/*  <Input placeholder="Filter" />*/}
        {/*</div>*/}
        <div className="flex flex-wrap space-x-2 gap-y-2">
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" selected={true} />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
          <RecentlyChosenItem label="item-1" />
        </div>
        <div className="grid grid-cols-3 ">
          <div className="flex-col space-y-3 overflow-y-scroll h-96 ">
            <div className="pr-2">
              <Input
                placeholder="Filter"
                className="focus-visible:ring-transparent"
              />
            </div>
            {Array.from({ length: 20 }).map(() => (
              <ClickableCategory label="root category" />
            ))}
          </div>
          <div className="flex-col space-y-3 overflow-y-scroll h-96 px-2">
            <div className="pr-2">
              <Input
                placeholder="Filter"
                className="focus-visible:ring-transparent"
              />
            </div>
            {Array.from({ length: 20 }).map(() => (
              <ClickableCategory label="root category" />
            ))}
          </div>
          <div className="flex-col space-y-3 overflow-y-scroll h-96 px-2">
            <div className="pr-2">
              <Input
                placeholder="Filter"
                className="focus-visible:ring-transparent"
              />
            </div>
            {Array.from({ length: 20 }).map(() => (
              <ClickableCategory label="root category" />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface IRecentlyChosenItem {
  label: string;
  selected?: boolean;
}

const RecentlyChosenItem = ({ label, selected }: IRecentlyChosenItem) => (
  <p
    className={cn(
      "text-sm rounded-md  p-1 cursor-pointer",
      selected ? "border border-primary text-primary" : "bg-slate-200",
    )}
  >
    {label}
  </p>
);

const ClickableCategory = ({ label }: { label: string }) => (
  <p className="cursor-pointer hover:bg-slate-200 p-1 rounded text-sm">
    {label}
  </p>
);

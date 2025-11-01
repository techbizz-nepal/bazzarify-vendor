"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { actionLogout } from "@/modules/guest/actions/login";
import { FaCog } from "react-icons/fa";

export default function AccountActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FaCog className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={actionLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

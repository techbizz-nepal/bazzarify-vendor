"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { actionLogout } from "@/modules/guest/actions/login";
import { useRouter } from "next/navigation";
import { FaCog } from "react-icons/fa";

export default function AccountActions() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FaCog className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a
            onClick={() => {
              console.log("on click logout");
              actionLogout().then((ok) => {
                if (ok) router.push("/login");
              });
            }}
          >
            Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

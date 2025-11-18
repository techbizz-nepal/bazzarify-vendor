import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { getSessionUser } from "@/modules/auth/data/auth-service";
import { actionLogout } from "@/modules/guest/actions/login";
import { Suspense } from "react";
import { FaCog } from "react-icons/fa";

export default async function AccountActions() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;
  return (
    <Suspense fallback={<FaCog />}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FaCog className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 gap-y-2 flex flex-col cursor-default">
          <DropdownMenuLabel className="flex flex-col items-center gap-y-3 bg-slate-200 ">
            <div>{sessionUser.name}</div>
            <div>{sessionUser.email}</div>
            <div>{sessionUser.roles.map((role) => role.name).join(",")}</div>
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={actionLogout} asChild className="w-full">
            <Button variant="destructive">Logout</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Suspense>
  );
}

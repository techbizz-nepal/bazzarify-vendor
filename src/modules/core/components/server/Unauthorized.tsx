import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Link href="/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}

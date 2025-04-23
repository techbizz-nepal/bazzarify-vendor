import Link from "next/link";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

export default function Unauthorized() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Link href="/login">
        <ThemedButton>Go to Login</ThemedButton>
      </Link>
    </div>
  );
}

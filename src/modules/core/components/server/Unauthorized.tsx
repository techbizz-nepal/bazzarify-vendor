import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Link href="/login">
        <ThemedButton>Go to Login</ThemedButton>
      </Link>
    </div>
  );
}

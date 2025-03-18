"use client";

import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import { useRouter } from "next/navigation";

export default function DashboardContainer() {
  const sessionCtx = use(SessionContext);
  const router = useRouter();
  if (!sessionCtx) {
    throw new Error("Session must be used within a SessionContextProvider");
  }
  const { session } = sessionCtx;
  console.log("session", session);
  useEffect(() => {
    if (!session) {
      return router.replace("/login");
    }
  }, [router, session]);
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <p>Welcome to dashboard.</p>
    </div>
  );
}

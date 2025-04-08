"use client";

import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default function DashboardContainer() {
  const sessionCtx = use(SessionContext);
  const router = useRouter();
  if (!sessionCtx) {
    throw new Error("Session must be used within a SessionContextProvider");
  }
  const { session } = sessionCtx;
  useEffect(() => {
    if (!session) {
      return router.replace("/login");
    }
  }, [router, session]);
  return (
    <PageContainer pageTitle={"Dashboard"}>
      <Statistics />
    </PageContainer>
  );
}

const Statistics = () => (
  <Card className="px-4 items-center justify-center" id="stats">
    <p>Welcome to dashboard.</p>
  </Card>
);

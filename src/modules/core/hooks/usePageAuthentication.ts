import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function usePageAuthentication() {
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

  return {
    router,
  };
}

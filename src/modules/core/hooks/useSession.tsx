import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function useSession(router: AppRouterInstance) {
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("SessionProvider must be used in correct place.");
  }
  const { session, toggleSession } = sessionCtx;

  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);

  return {
    toggleSession,
  };
}

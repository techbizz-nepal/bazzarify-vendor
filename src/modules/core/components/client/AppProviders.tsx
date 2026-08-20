"use client";

import CookieConsentBanner from "@/modules/core/components/client/CookieConsentBanner";
import GlobalToaster from "@/modules/core/components/client/GlobalToaster";
import { SessionProvider } from "@/modules/core/contexts/SessionContextProvider";
import QueryProvider from "@/modules/core/providers/queryProvider";
import { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <CookieConsentBanner />
        {children}
      </QueryProvider>
      <GlobalToaster />
    </SessionProvider>
  );
}

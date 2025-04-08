import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/modules/core/contexts/SessionContextProvider";
import React from "react";
import QueryProvider from "@/modules/core/providers/queryProvider";

const sora = Sora({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Welcome to Vendor Portal",
  description: "Manage Resources for the Vendor Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

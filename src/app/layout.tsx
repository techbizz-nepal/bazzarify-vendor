import { SessionProvider } from "@/modules/core/contexts/SessionContextProvider";
import QueryProvider from "@/modules/core/providers/queryProvider";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";

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
            <Toaster richColors={true} closeButton={true} />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

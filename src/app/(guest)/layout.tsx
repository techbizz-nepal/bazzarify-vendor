import { ReactNode } from "react";

export default function GuestLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-slate-200 overflow-auto">
      {children}
    </div>
  );
}

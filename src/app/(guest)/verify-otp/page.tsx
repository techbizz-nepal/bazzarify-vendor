"use client";

import { LoaderPinwheel } from "lucide-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoaderPinwheel />}>
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-200"></div>
    </Suspense>
  );
}

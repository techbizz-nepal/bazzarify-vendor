"use client";

import { Suspense } from "react";
import { LoaderPinwheel } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={<LoaderPinwheel />}>
      <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center"></div>
    </Suspense>
  );
}

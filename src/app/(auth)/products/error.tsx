"use client"; // Error boundaries must be Client Components

import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorComponent
      err="An unexpected error occurred while loading this segment."
      action={() => {
        reset();
        window.location.reload();
      }}
    />
  );
}

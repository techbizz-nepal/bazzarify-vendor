"use client";

import ErrorComponent from "@/modules/core/components/client/ErrorComponent";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorComponent
      err={`An unexpected error occurred while loading this segment.${error.digest ? ` (${error.digest})` : ""}`}
      action={() => {
        reset();
        window.location.reload();
      }}
    />
  );
}

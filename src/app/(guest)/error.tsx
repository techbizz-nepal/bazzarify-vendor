"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-foreground flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-background">
        {error.message === "403"
          ? error.message.concat(" | Forbidden")
          : error.message}
      </h1>
    </div>
  );
}

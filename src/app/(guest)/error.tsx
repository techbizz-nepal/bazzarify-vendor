"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-foreground w-full h-screen  flex flex-col justify-center items-center">
      <h1 className="text-background">
        {error.message === "403"
          ? error.message.concat(" | Forbidden")
          : error.message}
      </h1>
    </div>
  );
}

import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
  err: string | Error | null;
  action?: () => void;
}
export default function ErrorComponent({ err, action }: ErrorComponentProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex-col bg-red-300  rounded-4xl p-14 space-y-4">
        <h1 className="text-white font-bold">
          {err instanceof Error ? err.message : err}
        </h1>
        <Button
          variant="destructive"
          onClick={action || (() => window.location.reload())}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

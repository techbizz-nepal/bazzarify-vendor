import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackLinkButtonProps {
  href: string;
  label: string;
}

export default function BackLinkButton({
  href,
  label,
}: BackLinkButtonProps) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
}

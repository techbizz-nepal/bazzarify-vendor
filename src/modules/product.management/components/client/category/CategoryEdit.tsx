import { Card, CardContent } from "@/components/ui/card";

export default function CategoryEdit({ slug }: { slug: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center">
        <p className="text-primary text-2xl">Under Construction {slug}</p>
      </CardContent>
    </Card>
  );
}

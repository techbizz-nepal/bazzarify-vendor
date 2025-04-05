import { Card, CardContent } from "@/components/ui/card";

export default function CategoryEdit({ slug }: { slug: string }) {
  console.log(slug);
  return (
    <Card>
      <CardContent className="items-center flex justify-center">
        <p className="text-primary text-2xl">Under Construction</p>
      </CardContent>
    </Card>
  );
}

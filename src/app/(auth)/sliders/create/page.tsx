import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pageInfo = {
  name: { singular: "Slider", plural: "Sliders" },
  title: "Create Sliders",
  slug: "sliders",
  description: "create your slider",
};
export default function SliderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="text-2xl">{pageInfo.title}</p>
        </CardTitle>
        <CardDescription>{pageInfo.description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

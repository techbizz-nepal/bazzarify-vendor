import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateForm from "@/modules/marketing/presentation/slider/components/client/CreateForm";

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
      <CardContent className="flex flex-col gap-8">
        <Card className="w-full  ">
          <CardHeader>
            <CardTitle>
              Put basic {pageInfo.name.singular} information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateForm />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

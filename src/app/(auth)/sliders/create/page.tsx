import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import CreateForm from "@/modules/marketing/presentation/slider/components/client/CreateForm";

const pageInfo = {
  name: { singular: "Slider", plural: "Sliders" },
  title: "Create Sliders",
  slug: "sliders",
  description: "create your slider",
};
export default function SliderPage() {
  return (
    <PageContainer
      pageTitle={pageInfo.title}
      actionSlot={<BackLinkButton href="/sliders" label="Back to Sliders" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-2xl">{pageInfo.title}</p>
          </CardTitle>
          <CardDescription>{pageInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <Card className="w-full">
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
    </PageContainer>
  );
}

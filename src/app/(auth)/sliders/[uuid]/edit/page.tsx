import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default function EditSliderPage() {
  return (
    <PageContainer
      pageTitle="Edit Slider"
      actionSlot={<BackLinkButton href="/sliders" label="Back to Sliders" />}
    >
      <Card title="Edit Slider">
        {/* Edit Slider Form Component Goes Here */}
        <CardHeader>
          <CardTitle className="text-2xl ">Edit Slider</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}

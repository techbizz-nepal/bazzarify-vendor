import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IndexContent from "@/modules/marketing/presentation/components/client/IndexContent";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const pageInfo = {
  name: { singular: "Slider", plural: "Sliders" },
  title: "Manage Sliders",
  slug: "sliders",
  description: "manage your sliders with creating, updating",
  action: {
    create: {
      icon: <FaPlus className="mr-2" />,
      title: "New Slider",
      path: "/create",
    },
  },
};
export default function SliderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="text-2xl">{pageInfo.title}</p>
        </CardTitle>
        <CardDescription>{pageInfo.description}</CardDescription>
        <CardAction>
          <Link href="/sliders/create">
            <Button variant="default" size="sm">
              {pageInfo.action.create.icon}
              {pageInfo.action.create.title}
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <IndexContent />
      </CardContent>
    </Card>
  );
}

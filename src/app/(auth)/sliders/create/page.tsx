import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pageInfo = {
  name: { singular: "Category", plural: "Categories" },
  title: "Create new category",
  action: {
    create: {
      title: "Create Category",
      path: "",
    },
  },
  description:
    "manage your categories with creating, updating and assigning attributes and specifications",
  slug: "categories",
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

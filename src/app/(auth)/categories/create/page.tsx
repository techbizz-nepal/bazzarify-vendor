import { Button } from "@/components/ui/button";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getAuthUser, getSessionUserUUID } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import Create from "@/modules/product.management/components/client/category/Create";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CreateCategoryPage() {
  const userUuid = await getSessionUserUUID(await getCookieStore());
  const authUser = userUuid ? await getAuthUser(userUuid) : null;
  const isAdmin =
    authUser &&
    typeof authUser === "object" &&
    !("error" in authUser) &&
    authUser.roles.some(
      (role) => role.name === "super-admin" || role.name === "admin",
    );

  if (!isAdmin) {
    redirect("/categories");
  }

  const [categoryResponse, attributeResponse, specificationResponse] =
    await Promise.all([
      actionGetCategories({
        perPage: "200",
        filter: { rootOnly: true },
      }),
      actionGetAttributes({ perPage: "200" }),
      actionGetSpecifications({ perPage: "200" }),
    ]);

  const categories =
    categoryResponse &&
    typeof categoryResponse === "object" &&
    "categories" in categoryResponse
      ? categoryResponse.categories.data
      : [];
  const attributes =
    attributeResponse &&
    typeof attributeResponse === "object" &&
    "attributes" in attributeResponse
      ? attributeResponse.attributes.data
      : [];
  const specifications =
    specificationResponse?.data?.payload?.specifications?.data ?? [];

  return (
    <PageContainer
      pageTitle="Create Category"
      actionSlot={
        <Button asChild variant="outline" size="sm">
          <Link href="/categories">Back to Categories</Link>
        </Button>
      }
    >
      <Create
        categories={categories}
        attributes={attributes}
        specifications={specifications}
      />
    </PageContainer>
  );
}

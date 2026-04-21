import { redirect } from "next/navigation";

export default function LegacyProductImportPage() {
  redirect("/products/imports/new");
}

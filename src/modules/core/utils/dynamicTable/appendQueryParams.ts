import { IQueryParams } from "@/modules/core/types/dynamicTable";
import appendFilterParams from "@/modules/core/utils/dynamicTable/appendFilters";

export default function appendQueryParams(
  formData: FormData,
  queryParams: IQueryParams,
) {
  const { filters, page } = queryParams;
  const params = appendFilterParams(formData, filters);
  if (page) {
    formData.append("page", page.toString());
  }
  return params;
}

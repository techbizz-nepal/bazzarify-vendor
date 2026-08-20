import { TQueryParams } from "@/modules/core/domain/schemas/QueryParams";
import appendFilterParams from "@/modules/core/utils/dynamicTable/appendFilters";

export default function appendQueryParams(
  formData: FormData,
  queryParams: TQueryParams,
) {
  const { filters, page } = queryParams;
  const params = appendFilterParams(formData, filters);
  if (page > 1) {
    formData.append("page", page.toString());
  }
  return params;
}

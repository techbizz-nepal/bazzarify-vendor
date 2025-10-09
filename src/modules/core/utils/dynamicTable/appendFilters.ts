import { IFilters } from "@/modules/core/types/dynamicTable";

export default function appendFilterParams (formData: FormData, filters: IFilters) {
  if (filters.payment_method !== "null")
    formData.append("filter[payment_method]", filters.payment_method);
  if (filters.status !== "null")
    formData.append("filter[status]", filters.status);

  if (filters.from !== "null" && filters.to !== "null") {
    formData.append(
      "filter[placed_between]",
      `${filters.from},${filters.to}`,
    );
  } else if (filters.from !== "null" || filters.to !== "null") {
    if (filters.from) {
      formData.append("filter[placed_after]", filters.from);
    }
    if (filters.to) {
      formData.append("filter[placed_before]", filters.to);
    }
  }
  return formData;
};

import { TTableFilters } from "@/modules/core/domain/schemas/TableFilters";

export default function appendFilterParams(
  formData: FormData,
  filters: TTableFilters,
) {
  const appendIfValid = (key: string, value?: string) => {
    if (value && value !== "null") formData.append(`filter[${key}]`, value);
  };

  const { from, to, ...rest } = filters;

  // generic filters
  Object.entries(rest).forEach(([key, value]) => appendIfValid(key, value));

  // date filters
  const validFrom = from && from !== "null" ? from : null;
  const validTo = to && to !== "null" ? to : null;

  if (validFrom && validTo) {
    appendIfValid("placed_between", `${validFrom},${validTo}`);
  } else {
    appendIfValid("placed_after", validFrom ?? undefined);
    appendIfValid("placed_before", validTo ?? undefined);
  }

  return formData;
}

import { TableFilters } from "@/modules/core/domain/schemas/TableFilters";
import { z } from "zod";

export const QueryParams = z.object({
  filters: TableFilters,
  page: z.number(),
});

export type TQueryParams = z.infer<typeof QueryParams>;

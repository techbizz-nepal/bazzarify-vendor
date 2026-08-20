import { z } from "zod";

export const TableFilters = z.record(z.string(), z.string());

export type TTableFilters = z.infer<typeof TableFilters>;

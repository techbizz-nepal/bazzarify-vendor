import { TableColumn } from "@/modules/core/domain/schemas/TableColumn";
import { z } from "zod";

export const DynamicTablePropsSchema = <T extends z.ZodTypeAny>(
  recordSchema: T,
) => {
  return z.object({
    columns: z.array(TableColumn(recordSchema)),
    data: z.array(recordSchema),
    loading: z.boolean().optional(),
    emptyMessage: z.string().optional(),
    className: z.string().optional(),
  });
};
export type TDynamicTableProps<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof DynamicTablePropsSchema<T>>
>;

import { ReactNode } from "react";
import { z } from "zod";

export const TableColumn = <T extends z.ZodTypeAny>(recordSchema: T) => {
  return z.object({
    key: z.string(),
    title: z.string(),
    render: z
      .function({
        input: z.tuple([
          z.any(), // value
          recordSchema, // record of type T
          z.number(), // index
        ]),
        output: z.custom<ReactNode>(), // assume no runtime validation for ReactNode
      })
      .optional(),
    width: z.string().optional(),
    align: z.enum(["left", "center", "right"]).optional(),
  });
};

export type TTableColumn<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof TableColumn<T>>
>;

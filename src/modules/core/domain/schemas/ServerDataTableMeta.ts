import { z } from "zod";

export const ServerDataTableFilterOptionSchema = z
  .object({
    label: z.string(),
    value: z.string(),
  })
  .strict();

export const ServerDataTableFilterDefinitionSchema = z.discriminatedUnion(
  "type",
  [
    z
      .object({
        type: z.literal("text"),
        key: z.string(),
        label: z.string(),
        placeholder: z.string().optional(),
      })
      .strict(),
    z
      .object({
        type: z.literal("select"),
        key: z.string(),
        label: z.string(),
        placeholder: z.string().optional(),
        options: z.array(ServerDataTableFilterOptionSchema).default([]),
      })
      .strict(),
    z
      .object({
        type: z.literal("async-select"),
        key: z.string(),
        label: z.string(),
        placeholder: z.string().optional(),
        source: z.string(),
        selectedOption: ServerDataTableFilterOptionSchema.nullable().optional(),
      })
      .strict(),
    z
      .object({
        type: z.literal("date-range"),
        key: z.string(),
        label: z.string(),
        fromKey: z.string(),
        toKey: z.string(),
        maxMonths: z.number().int().positive().optional(),
      })
      .strict(),
  ],
);

export const ServerDataTableSearchSchema = z
  .object({
    queryKey: z.string(),
    placeholder: z.string(),
  })
  .strict();

export const ServerDataTableMetaSchema = z
  .object({
    search: ServerDataTableSearchSchema,
    filters: z.array(ServerDataTableFilterDefinitionSchema).default([]),
  })
  .strict();

export type TServerDataTableFilterOption = z.infer<
  typeof ServerDataTableFilterOptionSchema
>;
export type TServerDataTableFilterDefinition = z.infer<
  typeof ServerDataTableFilterDefinitionSchema
>;
export type TServerDataTableSearch = z.infer<
  typeof ServerDataTableSearchSchema
>;
export type TServerDataTableMeta = z.infer<typeof ServerDataTableMetaSchema>;

import { z } from "zod";

export const ImageSchema = z
  .object({
    uuid: z.uuid(),
    file: z.string(),
    pivot: z.object({
      imageable_uuid: z.uuid(),
      imageable_type: z.string(),
      image_uuid: z.uuid(),
      created_at: z.string().nullable(),
      updated_at: z.string().nullable(),
      deleted_at: z.string().nullable(),
    }),
  })
  .strict();

export type TImage = z.infer<typeof ImageSchema>;

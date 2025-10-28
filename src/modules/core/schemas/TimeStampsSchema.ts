import { z } from "zod";

const TimeStampsSchema = z.object({
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
});

export default TimeStampsSchema;

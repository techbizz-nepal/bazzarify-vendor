import { z } from "zod";

export const RemoveImageApiParams = z.object({
  uuid: z.uuid(),
  storageUrl: z.url(),
});

export type TRemoveImageApiParams = z.infer<typeof RemoveImageApiParams>;

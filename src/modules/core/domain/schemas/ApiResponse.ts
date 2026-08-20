import { MetaDataSchema } from "@/modules/core/domain/schemas/MetaDataSchema";
import { z } from "zod";

export const ApiResponseSchema = <Payload>(payloadItem: z.ZodType<Payload>) =>
  z.object({
    data: z.object({
      message: z.string(),
      payload: payloadItem.nullable(),
    }),
    metaData: MetaDataSchema,
  });

export default ApiResponseSchema;

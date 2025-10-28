import { z } from "zod";

const SpecRecord = z.record(z.string(), z.string());
const SpecificationsSchema: z.ZodType<Record<string, string> | null> =
  z.preprocess(
    (val) => (val === "null" || val === null ? null : val),
    SpecRecord.nullable(),
  );
export default SpecificationsSchema;

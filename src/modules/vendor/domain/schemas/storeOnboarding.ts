import { z } from "zod";

export const StoreOnboardingCategorySchema = z
  .object({
    uuid: z.uuid(),
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    parent_id: z.number(),
  })
  .strip();

export const StoreOnboardingCategorySetSchema = z
  .object({
    uuid: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    categories: z.array(StoreOnboardingCategorySchema),
  })
  .strip();

export const StoreTypeOptionSchema = z
  .object({
    uuid: z.uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    onboarding_category_set: StoreOnboardingCategorySetSchema.nullable(),
  })
  .strip();

export const StoreTypeIndexPayloadSchema = z
  .object({
    store_types: z.array(StoreTypeOptionSchema),
  })
  .strip();

export type TStoreOnboardingCategory = z.infer<
  typeof StoreOnboardingCategorySchema
>;
export type TStoreOnboardingCategorySet = z.infer<
  typeof StoreOnboardingCategorySetSchema
>;
export type TStoreTypeOption = z.infer<typeof StoreTypeOptionSchema>;
export type TStoreTypeIndexPayload = z.infer<
  typeof StoreTypeIndexPayloadSchema
>;

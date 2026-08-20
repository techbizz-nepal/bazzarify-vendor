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

export const StoreOnboardingCategoryOptionSchema = z
  .object({
    uuid: z.uuid(),
    name: z.string(),
    slug: z.string(),
    is_sellable: z.boolean().optional(),
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

export const StoreOnboardingBulkApplyPreviewStoreSchema = z
  .object({
    uuid: z.uuid(),
    name: z.string(),
    slug: z.string(),
    current_category_count: z.number().int().nonnegative(),
    missing_category_count: z.number().int().nonnegative(),
    will_change: z.boolean(),
  })
  .strip();

export const StoreOnboardingBulkApplyPreviewSchema = z
  .object({
    store_type_uuid: z.uuid(),
    store_type_name: z.string(),
    category_uuids: z.array(z.uuid()),
    category_count: z.number().int().nonnegative(),
    store_count: z.number().int().nonnegative(),
    stores_needing_apply_count: z.number().int().nonnegative(),
    stores_already_aligned_count: z.number().int().nonnegative(),
    stores: z.array(StoreOnboardingBulkApplyPreviewStoreSchema),
  })
  .strip();

export const StoreOnboardingBulkApplyResultSchema = z
  .object({
    store_type_uuid: z.uuid(),
    applied_store_count: z.number().int().nonnegative(),
    added_category_assignments: z.number().int().nonnegative(),
    unchanged_store_count: z.number().int().nonnegative(),
  })
  .strip();

export type TStoreOnboardingCategory = z.infer<
  typeof StoreOnboardingCategorySchema
>;
export type TStoreOnboardingCategoryOption = z.infer<
  typeof StoreOnboardingCategoryOptionSchema
>;
export type TStoreOnboardingCategorySet = z.infer<
  typeof StoreOnboardingCategorySetSchema
>;
export type TStoreTypeOption = z.infer<typeof StoreTypeOptionSchema>;
export type TStoreTypeIndexPayload = z.infer<
  typeof StoreTypeIndexPayloadSchema
>;
export type TStoreOnboardingBulkApplyPreview = z.infer<
  typeof StoreOnboardingBulkApplyPreviewSchema
>;
export type TStoreOnboardingBulkApplyResult = z.infer<
  typeof StoreOnboardingBulkApplyResultSchema
>;

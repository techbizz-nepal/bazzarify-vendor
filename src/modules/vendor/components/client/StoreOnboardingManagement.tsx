"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TCategoryIndexPayload } from "@/modules/product.management";
import {
  actionApplyAdminStoreOnboardingBulk,
  actionPreviewAdminStoreOnboardingBulkApply,
  actionUpdateAdminStoreOnboardingSet,
} from "@/modules/vendor/domain/store-actions";
import {
  TStoreOnboardingBulkApplyPreview,
  TStoreTypeOption,
} from "@/modules/vendor/domain/schemas/storeOnboarding";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type LeafCategory = TCategoryIndexPayload["categories"]["data"][number];

interface StoreOnboardingManagementProps {
  storeTypes: TStoreTypeOption[];
  leafCategories: LeafCategory[];
}

export default function StoreOnboardingManagement({
  storeTypes,
  leafCategories,
}: StoreOnboardingManagementProps) {
  const getDraftState = (storeType: TStoreTypeOption | null) => {
    const onboardingSet = storeType?.onboarding_category_set;

    return {
      draftName: onboardingSet?.name ?? "Starter onboarding set",
      draftDescription: onboardingSet?.description ?? "",
      selectedCategoryUuids:
        onboardingSet?.categories.map((category) => category.uuid) ?? [],
    };
  };

  const [storeTypeOptions, setStoreTypeOptions] = useState(storeTypes);
  const [selectedStoreTypeUuid, setSelectedStoreTypeUuid] = useState(
    storeTypes[0]?.uuid ?? "",
  );
  const initialDraftState = getDraftState(storeTypes[0] ?? null);
  const [draftName, setDraftName] = useState(initialDraftState.draftName);
  const [draftDescription, setDraftDescription] = useState(
    initialDraftState.draftDescription,
  );
  const [selectedCategoryUuids, setSelectedCategoryUuids] = useState<string[]>(
    initialDraftState.selectedCategoryUuids,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [bulkPreview, setBulkPreview] =
    useState<TStoreOnboardingBulkApplyPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);

  const selectedStoreType = useMemo(
    () =>
      storeTypeOptions.find(
        (storeType) => storeType.uuid === selectedStoreTypeUuid,
      ) ??
      null,
    [selectedStoreTypeUuid, storeTypeOptions],
  );

  const applyStoreTypeSelection = (storeType: TStoreTypeOption | null) => {
    const nextDraftState = getDraftState(storeType);

    setSelectedStoreTypeUuid(storeType?.uuid ?? "");
    setDraftName(nextDraftState.draftName);
    setDraftDescription(nextDraftState.draftDescription);
    setSelectedCategoryUuids(nextDraftState.selectedCategoryUuids);
  };

  const selectedCategoryNameSet = useMemo(
    () =>
      new Set(
        leafCategories
          .filter((category) => selectedCategoryUuids.includes(category.uuid))
          .map((category) => category.name),
      ),
    [leafCategories, selectedCategoryUuids],
  );

  const handleToggleCategory = (categoryUuid: string, checked: boolean) => {
    setSelectedCategoryUuids((current) =>
      checked
        ? [...current, categoryUuid]
        : current.filter((uuid) => uuid !== categoryUuid),
    );
  };

  const handleSave = () => {
    if (!selectedStoreType) {
      toast.error("Select a store type first.");
      return;
    }

    if (selectedCategoryUuids.length === 0) {
      toast.error("Assign at least one leaf category.");
      return;
    }

    setIsSaving(true);

    startTransition(() => {
      void actionUpdateAdminStoreOnboardingSet({
        storeTypeUuid: selectedStoreType.uuid,
        name: draftName.trim() || "Starter onboarding set",
        description: draftDescription.trim() || null,
        categoryUuids: selectedCategoryUuids,
      })
        .then((response) => {
          if (
            "metaData" in response ||
            !("uuid" in response)
          ) {
            toast.error(response.metaData.error);
            return;
          }

          setStoreTypeOptions((current) =>
            current.map((storeType) =>
              storeType.uuid === response.uuid ? response : storeType,
            ),
          );
          applyStoreTypeSelection(response);
          void loadBulkPreview(response.uuid);
          toast.success("Onboarding categories updated for future stores.");
        })
        .catch((error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to update onboarding categories.";
          toast.error(message);
        })
        .finally(() => {
          setIsSaving(false);
        });
    });
  };

  const loadBulkPreview = async (storeTypeUuid: string) => {
    setIsLoadingPreview(true);

    try {
      const response = await actionPreviewAdminStoreOnboardingBulkApply(
        storeTypeUuid,
      );

      if ("metaData" in response) {
        setBulkPreview(null);
        if (response.metaData.error) {
          toast.error(response.metaData.error);
        }
        return;
      }

      setBulkPreview(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to preview bulk apply.";
      toast.error(message);
      setBulkPreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (!selectedStoreTypeUuid) {
      setBulkPreview(null);
      return;
    }

    void loadBulkPreview(selectedStoreTypeUuid);
  }, [selectedStoreTypeUuid]);

  const handleBulkApply = () => {
    if (!selectedStoreType || !bulkPreview) {
      toast.error("Select a store type with a valid onboarding set first.");
      return;
    }

    setIsApplyingBulk(true);

    startTransition(() => {
      void actionApplyAdminStoreOnboardingBulk(selectedStoreType.uuid)
        .then((response) => {
          if ("metaData" in response) {
            toast.error(response.metaData.error);
            return;
          }

          toast.success(
            `Applied onboarding defaults to ${response.applied_store_count} stores.`,
          );
          void loadBulkPreview(selectedStoreType.uuid);
        })
        .catch((error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to apply onboarding defaults.";
          toast.error(message);
        })
        .finally(() => {
          setIsApplyingBulk(false);
        });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Store Types</CardTitle>
          <CardDescription>
            One onboarding set per store type. Changes affect future stores
            only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {storeTypeOptions.map((storeType) => {
            const isSelected = storeType.uuid === selectedStoreTypeUuid;
            const categoryCount =
              storeType.onboarding_category_set?.categories.length ?? 0;

            return (
              <button
                key={storeType.uuid}
                type="button"
                onClick={() => applyStoreTypeSelection(storeType)}
                className={[
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:border-slate-400",
                ].join(" ")}
              >
                <div className="font-medium">{storeType.name}</div>
                {storeType.description ? (
                  <div
                    className={[
                      "mt-1 text-sm",
                      isSelected ? "text-slate-200" : "text-slate-600",
                    ].join(" ")}
                  >
                    {storeType.description}
                  </div>
                ) : null}
                <div
                  className={[
                    "mt-2 text-xs uppercase tracking-wide",
                    isSelected ? "text-slate-300" : "text-slate-500",
                  ].join(" ")}
                >
                  {categoryCount} starter categories
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Category Set</CardTitle>
          <CardDescription>
            Edit the default categories new stores receive for the selected
            store type. Existing stores are unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedStoreType ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="onboarding-set-name">Set Name</Label>
                  <Input
                    id="onboarding-set-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboarding-set-description">
                    Description
                  </Label>
                  <Textarea
                    id="onboarding-set-description"
                    value={draftDescription}
                    onChange={(event) =>
                      setDraftDescription(event.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
                Selected type:
                <span className="ml-2 font-semibold text-slate-900">
                  {selectedStoreType.name}
                </span>
                <div className="mt-2">
                  Future stores of this type will receive the checked leaf
                  categories below. Existing stores will not be changed.
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {leafCategories.map((category) => {
                  const isChecked = selectedCategoryUuids.includes(
                    category.uuid,
                  );

                  return (
                    <label
                      key={category.uuid}
                      className="flex cursor-pointer items-start gap-3 rounded-md border p-3"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleToggleCategory(category.uuid, checked === true)
                        }
                      />
                      <div>
                        <div className="font-medium text-slate-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {category.slug}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-medium text-slate-900">
                  Selected categories
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategoryNameSet.size > 0 ? (
                    [...selectedCategoryNameSet].map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">
                      No categories selected yet.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <ThemedButton onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save onboarding set"}
                </ThemedButton>
              </div>

              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-900">
                      Apply to Existing Stores
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Add any missing onboarding categories to stores of this
                      type. Existing store categories are preserved.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ThemedButton
                      variant="outline"
                      onClick={() => void loadBulkPreview(selectedStoreType.uuid)}
                      disabled={isLoadingPreview}
                    >
                      {isLoadingPreview ? "Refreshing..." : "Refresh preview"}
                    </ThemedButton>
                    <ThemedButton
                      onClick={handleBulkApply}
                      disabled={
                        isApplyingBulk ||
                        !bulkPreview ||
                        bulkPreview.stores_needing_apply_count === 0
                      }
                    >
                      {isApplyingBulk ? "Applying..." : "Apply to stores"}
                    </ThemedButton>
                  </div>
                </div>

                {bulkPreview ? (
                  <>
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="rounded-md border bg-white p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Stores
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {bulkPreview.store_count}
                        </div>
                      </div>
                      <div className="rounded-md border bg-white p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Need Apply
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {bulkPreview.stores_needing_apply_count}
                        </div>
                      </div>
                      <div className="rounded-md border bg-white p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Already Aligned
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {bulkPreview.stores_already_aligned_count}
                        </div>
                      </div>
                      <div className="rounded-md border bg-white p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Default Categories
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {bulkPreview.category_count}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border bg-white p-4">
                      <div className="font-medium text-slate-900">
                        Stores affected
                      </div>
                      <div className="mt-3 space-y-2">
                        {bulkPreview.stores.slice(0, 8).map((store) => (
                          <div
                            key={store.uuid}
                            className="flex items-center justify-between gap-4 rounded-md border p-3 text-sm"
                          >
                            <div>
                              <div className="font-medium text-slate-900">
                                {store.name}
                              </div>
                              <div className="text-slate-500">{store.slug}</div>
                            </div>
                            <div className="text-right text-slate-600">
                              <div>{store.current_category_count} current</div>
                              <div>
                                {store.missing_category_count} missing
                              </div>
                            </div>
                          </div>
                        ))}
                        {bulkPreview.stores.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No stores found for this store type yet.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md border bg-white p-4 text-sm text-slate-500">
                    Preview unavailable for the selected store type.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              No store types are available to manage right now.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

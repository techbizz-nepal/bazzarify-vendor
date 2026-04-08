"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  actionApplyAdminStoreOnboardingBulk,
  actionPreviewAdminStoreOnboardingBulkApply,
  actionSearchAdminSellableCategories,
  actionUpdateAdminStoreOnboardingSet,
} from "@/modules/vendor/domain/store-actions";
import {
  TStoreOnboardingBulkApplyPreview,
  TStoreOnboardingCategoryOption,
  TStoreTypeOption,
} from "@/modules/vendor/domain/schemas/storeOnboarding";
import { Check, ChevronsUpDown, LoaderCircle, X } from "lucide-react";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface StoreOnboardingManagementProps {
  storeTypes: TStoreTypeOption[];
}

export default function StoreOnboardingManagement({
  storeTypes,
}: StoreOnboardingManagementProps) {
  const getDraftState = (storeType: TStoreTypeOption | null) => {
    const onboardingSet = storeType?.onboarding_category_set;

    return {
      draftName: onboardingSet?.name ?? "Starter onboarding set",
      draftDescription: onboardingSet?.description ?? "",
      selectedCategories:
        onboardingSet?.categories.map((category) => ({
          uuid: category.uuid,
          name: category.name,
          slug: category.slug,
        })) ?? [],
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
  const [selectedCategories, setSelectedCategories] = useState<
    TStoreOnboardingCategoryOption[]
  >(initialDraftState.selectedCategories);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkPreview, setBulkPreview] =
    useState<TStoreOnboardingBulkApplyPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const deferredCategorySearch = useDeferredValue(categorySearch);
  const [searchResults, setSearchResults] = useState<
    TStoreOnboardingCategoryOption[]
  >([]);
  const [searchPage, setSearchPage] = useState(1);
  const [hasNextSearchPage, setHasNextSearchPage] = useState(false);
  const [isSearchingCategories, setIsSearchingCategories] = useState(false);

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
    setSelectedCategories(nextDraftState.selectedCategories);
    setCategorySearch("");
    setSearchResults([]);
    setSearchPage(1);
    setHasNextSearchPage(false);
  };

  const selectedCategoryUuids = useMemo(
    () => selectedCategories.map((category) => category.uuid),
    [selectedCategories],
  );

  const selectedCategoryNames = useMemo(
    () =>
      [...selectedCategories.map((category) => category.name)].sort((left, right) =>
        left.localeCompare(right),
      ),
    [selectedCategories],
  );

  const selectedCategoryChips = useMemo(
    () =>
      [...selectedCategories].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    [selectedCategories],
  );

  const handleToggleCategory = (
    category: TStoreOnboardingCategoryOption,
    checked: boolean,
  ) => {
    setSelectedCategories((current) => {
      if (checked) {
        if (current.some((entry) => entry.uuid === category.uuid)) {
          return current;
        }
        return [...current, category];
      }

      return current.filter((entry) => entry.uuid !== category.uuid);
    });
  };

  const handleSave = () => {
    if (!selectedStoreType) {
      toast.error("Select a store type first.");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Assign at least one sellable category.");
      return;
    }

    setIsSaving(true);

    startTransition(() => {
      void actionUpdateAdminStoreOnboardingSet({
        storeTypeUuid: selectedStoreType.uuid,
        name: draftName.trim() || "Starter onboarding set",
        description: draftDescription.trim() || null,
        categoryUuids: selectedCategories.map((category) => category.uuid),
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

  useEffect(() => {
    const search = deferredCategorySearch.trim();

    if (!isCategoryPickerOpen || search.length === 0) {
      setSearchResults([]);
      setSearchPage(1);
      setHasNextSearchPage(false);
      setIsSearchingCategories(false);
      return;
    }

    setIsSearchingCategories(true);

    void actionSearchAdminSellableCategories({
      search,
      page: searchPage,
    })
      .then((response) => {
        if ("error" in response) {
          setSearchResults([]);
          setHasNextSearchPage(false);
          if (response.error) {
            toast.error(response.error);
          }
          return;
        }

        setSearchResults((current) =>
          searchPage === 1
            ? response.categories
            : [
                ...current,
                ...response.categories.filter(
                  (category) =>
                    !current.some((entry) => entry.uuid === category.uuid),
                ),
              ],
        );
        setHasNextSearchPage(response.hasNextPage);
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load sellable categories.";
        toast.error(message);
        setSearchResults([]);
        setHasNextSearchPage(false);
      })
      .finally(() => {
        setIsSearchingCategories(false);
      });
  }, [deferredCategorySearch, isCategoryPickerOpen, searchPage]);

  const handleCategorySearchChange = (value: string) => {
    setCategorySearch(value);
    setSearchPage(1);
  };

  const handleLoadMoreCategories = () => {
    if (!hasNextSearchPage || isSearchingCategories) {
      return;
    }

    setSearchPage((current) => current + 1);
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
                  {categoryCount} starter sellable categories
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
                  Future stores of this type will receive the checked sellable
                  categories below. Existing stores will not be changed.
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-900">
                      Starter categories
                    </div>
                    <div className="text-sm text-slate-600">
                      Search and select sellable categories for new stores of
                      this type.
                    </div>
                  </div>
                  <Popover
                    open={isCategoryPickerOpen}
                    onOpenChange={setIsCategoryPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="min-w-[240px] justify-between"
                      >
                        <span className="truncate">
                          {selectedCategoryUuids.length > 0
                            ? `${selectedCategoryUuids.length} categories selected`
                            : "Select starter categories"}
                        </span>
                        <ChevronsUpDown className="opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[360px] p-0" align="end">
                      <Command shouldFilter={false}>
                        <CommandInput
                          value={categorySearch}
                          onValueChange={handleCategorySearchChange}
                          placeholder="Search sellable categories..."
                        />
                        <CommandList>
                          {deferredCategorySearch.trim().length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-slate-500">
                              Type to search sellable categories.
                            </div>
                          ) : null}
                          {deferredCategorySearch.trim().length > 0 &&
                          !isSearchingCategories &&
                          searchResults.length === 0 ? (
                            <CommandEmpty>No matching categories.</CommandEmpty>
                          ) : null}
                          <CommandGroup>
                            <ScrollArea className="h-72">
                              <div className="p-1">
                                {searchResults.map((category) => {
                                  const isChecked = selectedCategoryUuids.includes(
                                    category.uuid,
                                  );

                                  return (
                                    <CommandItem
                                      key={category.uuid}
                                      value={`${category.name} ${category.slug}`}
                                      onSelect={() =>
                                        handleToggleCategory(
                                          category,
                                          !isChecked,
                                        )
                                      }
                                      className="items-start gap-3 py-2"
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          handleToggleCategory(
                                            category,
                                            checked === true,
                                          )
                                        }
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="truncate font-medium text-slate-900">
                                          {category.name}
                                        </div>
                                        <div className="truncate text-xs text-slate-500">
                                          {category.slug}
                                        </div>
                                      </div>
                                      {isChecked ? (
                                        <Check className="mt-0.5 text-slate-900" />
                                      ) : null}
                                    </CommandItem>
                                  );
                                })}
                                {isSearchingCategories ? (
                                  <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
                                    <LoaderCircle className="size-4 animate-spin" />
                                    Searching categories...
                                  </div>
                                ) : null}
                                {hasNextSearchPage && !isSearchingCategories ? (
                                  <div className="px-3 py-3">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full"
                                      onClick={handleLoadMoreCategories}
                                    >
                                      Load more results
                                    </Button>
                                  </div>
                                ) : null}
                              </div>
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">
                      Selected categories
                    </div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      {selectedCategoryUuids.length} selected
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCategoryChips.length > 0 ? (
                      <div className="max-h-40 w-full overflow-y-auto pr-1">
                        <div className="flex flex-wrap gap-2">
                          {selectedCategoryChips.map((category) => (
                            <button
                              key={category.uuid}
                              type="button"
                              onClick={() => handleToggleCategory(category, false)}
                              className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
                            >
                              <span className="truncate">{category.name}</span>
                              <X className="size-3 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">
                        No categories selected yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save onboarding set"}
                </Button>
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
                    <Button
                      variant="outline"
                      onClick={() => void loadBulkPreview(selectedStoreType.uuid)}
                      disabled={isLoadingPreview}
                    >
                      {isLoadingPreview ? "Refreshing..." : "Refresh preview"}
                    </Button>
                    <Button
                      onClick={handleBulkApply}
                      disabled={
                        isApplyingBulk ||
                        !bulkPreview ||
                        bulkPreview.stores_needing_apply_count === 0
                      }
                    >
                      {isApplyingBulk ? "Applying..." : "Apply to stores"}
                    </Button>
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

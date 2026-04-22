import {
  TImage,
  TVariant,
  TVariantDataMap,
} from "@/modules/product.management";
import { MAX_VARIANT_IMAGE_COUNT } from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { createVariantDraftKey } from "@/modules/product.management/utils/variantDraft";
import React, { useCallback, useMemo, useState } from "react";

interface useVariantProps {
  variantSelections: Record<string, string[]>;
  setVariantSelections: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onExistingVariantImageRemove?: (
    combo: string[],
    url: string,
  ) => Promise<boolean>;
}

const EMPTY_VARIANT_SEED: TVariant = {
  name: "",
  stock: "",
  price: "",
  available: true,
  images: [],
  isValid: false,
};

const parseComboKey = (key: string): string[] => {
  try {
    const parsed = JSON.parse(key) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const buildCartesian = (
  columns: readonly string[],
  selections: Record<string, string[]>,
): string[][] =>
  columns.reduce<string[][]>(
    (acc, column) =>
      acc.flatMap((combo) =>
        (selections[column] || []).map((value) => [...combo, value]),
      ),
    [[]],
  );

export default function useVariant({
  variantSelections,
  setVariantSelections,
  onExistingVariantImageRemove,
}: useVariantProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<TVariantDataMap>({});

  // Variants grid rows are driven by the actual entries in `variantData`, not by
  // a synthetic cartesian product of selected attribute values. This guarantees
  // sparse matrices (e.g. bulk-imported products with only a subset of combos)
  // render exactly the variants that exist, without fabricated empty duplicates.
  const combinations = useMemo<string[][]>(
    () =>
      Object.keys(variantData)
        .map(parseComboKey)
        .filter((combo) => combo.length > 0),
    [variantData],
  );

  const applyToggle = useCallback(
    (attribute: string, value: string) => {
      const currentAttrValues = variantSelections[attribute] || [];
      const isAdding = !currentAttrValues.includes(value);
      const nextAttrValues = isAdding
        ? [...currentAttrValues, value]
        : currentAttrValues.filter((v) => v !== value);

      const nextSelections: Record<string, string[]> = {
        ...variantSelections,
        [attribute]: nextAttrValues,
      };

      const prevActiveAttrs = Object.keys(variantSelections).filter(
        (attr) => (variantSelections[attr] || []).length > 0,
      );
      const nextActiveAttrs = Object.keys(nextSelections).filter(
        (attr) => nextSelections[attr].length > 0,
      );

      const nextColumns = columns
        .filter((col) => nextActiveAttrs.includes(col))
        .concat(nextActiveAttrs.filter((col) => !columns.includes(col)));

      const dimensionChanged =
        prevActiveAttrs.length !== nextActiveAttrs.length;

      let nextVariantData: TVariantDataMap;

      if (dimensionChanged || Object.keys(variantData).length === 0) {
        const cartesian = buildCartesian(nextColumns, nextSelections);
        nextVariantData = {};
        for (const combo of cartesian) {
          if (combo.length === 0) continue;
          const key = createVariantDraftKey(combo);
          nextVariantData[key] = variantData[key] ?? { ...EMPTY_VARIANT_SEED };
        }
      } else if (isAdding) {
        const attrIdx = nextColumns.indexOf(attribute);
        const otherColumns = nextColumns.filter((c) => c !== attribute);
        const otherCartesian = buildCartesian(otherColumns, nextSelections);
        nextVariantData = { ...variantData };
        for (const row of otherCartesian) {
          const combo = [...row];
          combo.splice(attrIdx, 0, value);
          const key = createVariantDraftKey(combo);
          if (!nextVariantData[key]) {
            nextVariantData[key] = { ...EMPTY_VARIANT_SEED };
          }
        }
      } else {
        const attrIdx = columns.indexOf(attribute);
        nextVariantData = {};
        for (const [key, data] of Object.entries(variantData)) {
          const combo = parseComboKey(key);
          if (attrIdx < 0 || combo[attrIdx] !== value) {
            nextVariantData[key] = data;
          }
        }
      }

      setVariantSelections(nextSelections);
      setColumns(nextColumns);
      setVariantData(nextVariantData);
    },
    [columns, setVariantSelections, variantData, variantSelections],
  );

  const toggleValue = useCallback(
    (attribute: string, value: string) => {
      applyToggle(attribute, value);
    },
    [applyToggle],
  );

  const removeValue = useCallback(
    (attribute: string, value: string) => {
      const currentAttrValues = variantSelections[attribute] || [];
      if (!currentAttrValues.includes(value)) return;
      applyToggle(attribute, value);
    },
    [applyToggle, variantSelections],
  );

  const handleVariantChange = <K extends keyof TVariant>(
    combo: string[],
    field: K,
    value: TVariant[K],
  ) => {
    const key = createVariantDraftKey(combo);
    setVariantData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || EMPTY_VARIANT_SEED), [field]: value },
    }));
  };

  const handleImageUpload = (combo: string[], files: FileList) => {
    const key = createVariantDraftKey(combo);
    const fileList = Array.from(files).filter((file) => file instanceof File);
    setVariantData((prev) => {
      const existingAll = prev[key]?.images || [];
      const existing = [...existingAll];
      const remaining = Math.max(0, MAX_VARIANT_IMAGE_COUNT - existing.length);
      if (remaining <= 0) {
        return prev;
      }
      const toAdd = fileList.slice(0, remaining);
      return {
        ...prev,
        [key]: {
          ...(prev[key] || EMPTY_VARIANT_SEED),
          images: [...existing, ...toAdd].slice(0, MAX_VARIANT_IMAGE_COUNT),
        },
      };
    });
  };

  const handleImageRemove = async (
    combo: string[],
    image: File | string | TImage,
  ) => {
    const key = createVariantDraftKey(combo);
    if (typeof image === "string" && onExistingVariantImageRemove) {
      const ok = await onExistingVariantImageRemove(combo, image);
      if (!ok) return;
    }
    setVariantData((prev) => {
      const images = prev[key]?.images?.filter((img) => img !== image) || [];
      return {
        ...prev,
        [key]: {
          ...(prev[key] || EMPTY_VARIANT_SEED),
          images,
        },
      };
    });
  };

  const handleReorderColumns = (newOrder: string[]) => {
    setColumns(newOrder);
  };

  return {
    toggleValue,
    removeValue,
    combinations,
    variantData,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
    columns,
    handleReorderColumns,
    setVariantData,
    setColumns,
  };
}

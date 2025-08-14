import { TVariant, TVariantDataMap } from "@/modules/product.management";
import { generateCombinations } from "@/modules/product.management/utils/generateCombinations";
import { MAX_VARIANT_IMAGE_COUNT } from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import React, { useMemo, useRef, useState } from "react";

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
export default function useVariant({
  variantSelections,
  setVariantSelections,
  onExistingVariantImageRemove,
}: useVariantProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<TVariantDataMap>({});
  // Map of combo key -> input element to ensure per-row file input triggers the correct combo
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const toggleValue = (attribute: string, value: string) => {
    setVariantSelections((prev) => {
      const current = prev[attribute] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const next = { ...prev, [attribute]: updated };

      // Update columns based on filtered keys that still have values
      const newColumnList = Object.keys(next).filter(
        (attr) => next[attr].length > 0,
      );
      setColumns((prevCols) => {
        return prevCols
          .filter((col) => newColumnList.includes(col))
          .concat(newColumnList.filter((col) => !prevCols.includes(col)));
      });

      return next;
    });
  };

  const removeValue = (attribute: string, value: string) => {
    setVariantSelections((prev) => {
      const current = prev[attribute] || [];
      const updated = current.filter((v) => v !== value);
      const next = { ...prev, [attribute]: updated };
      // Clean up variantData keys that are no longer valid
      const remainingCombinations = generateCombinations(next);
      const keepKeys = new Set(
        remainingCombinations.map((combo) => combo.join("|")),
      );

      setVariantData((prevData) => {
        const newData: typeof prevData = {};
        for (const key in prevData) {
          if (keepKeys.has(key)) {
            newData[key] = prevData[key]; // keep valid
          }
        }
        return newData;
      });

      return next;
    });
  };
  const combinations = useMemo(() => {
    const entries = Object.entries(variantSelections).filter(
      ([, values]) => values.length > 0,
    );
    if (entries.length === 0) return []; // no attribute values selected
    if (entries.length === 1) {
      return entries[0][1].map((value) => [value]); // map to single-value combos
    }
    return generateCombinations(variantSelections); // default behavior for >1 attribute
  }, [variantSelections]);

  const handleVariantChange = <K extends keyof TVariant>(
    combo: string[],
    field: K,
    value: TVariant[K],
  ) => {
    const key = combo.join("|");
    setVariantData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };

  const handleImageUpload = (combo: string[], files: FileList) => {
    const key = combo.join("|");
    const fileList = Array.from(files).filter((file) => file instanceof File);
    setVariantData((prev) => {
      const existingAll = (prev[key]?.images || []);
      // Keep both existing string URLs and Files
      const existing = [...existingAll];
      // Determine remaining slots considering both existing strings and Files
      const remaining = Math.max(0, MAX_VARIANT_IMAGE_COUNT - existing.length);
      if (remaining <= 0) {
        return prev; // cannot add more
      }
      // Take only up to remaining new files
      const toAdd = fileList.slice(0, remaining);
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: [...existing, ...toAdd].slice(0, MAX_VARIANT_IMAGE_COUNT),
        },
      };
    });
  };

  const handleImageRemove = async (combo: string[], image: File | string) => {
    const key = combo.join("|");
    if (typeof image === "string" && onExistingVariantImageRemove) {
      const ok = await onExistingVariantImageRemove(combo, image);
      if (!ok) return; // abort removal if API fails
    }
    setVariantData((prev) => {
      const images = prev[key]?.images?.filter((img) => img !== image) || [];
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
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

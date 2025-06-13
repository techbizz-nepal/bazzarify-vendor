import { TVariant, TVariantDataMap } from "@/modules/product.management";
import { generateCombinations } from "@/modules/product.management/utils/generateCombinations";
import React, { useMemo, useState } from "react";

interface useVariantProps {
  variantSelections: Record<string, string[]>;
  setVariantSelections: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}
export default function useVariant({
  variantSelections,
  setVariantSelections,
}: useVariantProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<TVariantDataMap>({});

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
      const existing = (prev[key]?.images || []).filter(
        (img) => img instanceof File,
      );
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: [...existing, ...fileList].slice(0, 3),
        },
      };
    });
  };

  const handleImageRemove = (combo: string[], image: File) => {
    const key = combo.join("|");
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

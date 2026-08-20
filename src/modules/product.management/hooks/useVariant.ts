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
  /**
   * Per-product attribute dimension cap. Create = MAX_ATTRIBUTE_DIMENSIONS
   * (hard 3). Edit = max(MAX_ATTRIBUTE_DIMENSIONS, initialActiveAttrs) so
   * legacy products over the cap stay editable (grandfather clause) but
   * cannot grow further.
   */
  attributeCap?: number;
}

export interface VariantRow {
  rowId: string;
  combo: string[];
  comboKey: string;
  uuid?: string;
}

export const EMPTY_VARIANT_SEED: TVariant = {
  name: "",
  stock: "",
  price: "",
  available: true,
  images: [],
  isValid: false,
};

export const MAX_ATTRIBUTE_DIMENSIONS = 3;

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

const createTmpRowId = (comboKey: string) => `tmp-${comboKey}`;

export default function useVariant({
  variantSelections,
  setVariantSelections,
  onExistingVariantImageRemove,
  attributeCap = MAX_ATTRIBUTE_DIMENSIONS,
}: useVariantProps) {
  const effectiveCap = Math.max(MAX_ATTRIBUTE_DIMENSIONS, attributeCap);
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<TVariantDataMap>({});
  const [removedVariantUuids, setRemovedVariantUuids] = useState<string[]>([]);

  // Grid rows derive from actual entries in `variantData`, never from a
  // synthetic cartesian product of selections. See Variant Editor Parity
  // invariant. Row identity is UUID (server) or stable tmp-id (session).
  const rows = useMemo<VariantRow[]>(() => {
    const result: VariantRow[] = [];
    for (const comboKey of Object.keys(variantData)) {
      const combo = parseComboKey(comboKey);
      if (combo.length === 0) continue;
      const uuid = variantData[comboKey]?.uuid;
      const row: VariantRow = {
        rowId: uuid ?? createTmpRowId(comboKey),
        combo,
        comboKey,
      };
      if (uuid) row.uuid = uuid;
      result.push(row);
    }
    return result;
  }, [variantData]);

  const combinations = useMemo<string[][]>(
    () => rows.map((row) => row.combo),
    [rows],
  );

  const addVariant = useCallback((combo: string[]) => {
    const cleanCombo = combo.map((v) => (v ?? "").toString());
    if (cleanCombo.some((v) => v.trim() === "")) {
      return;
    }
    const key = createVariantDraftKey(cleanCombo);
    setVariantData((prev) => {
      if (prev[key]) {
        return prev;
      }
      return { ...prev, [key]: { ...EMPTY_VARIANT_SEED } };
    });
  }, []);

  const generateMissingCombinations = useCallback(() => {
    const activeColumns = columns.filter(
      (col) => (variantSelections[col] || []).length > 0,
    );
    if (activeColumns.length === 0) return;
    const cartesian = buildCartesian(activeColumns, variantSelections);
    setVariantData((prev) => {
      const next = { ...prev };
      for (const combo of cartesian) {
        if (combo.length === 0) continue;
        const key = createVariantDraftKey(combo);
        if (!next[key]) {
          next[key] = { ...EMPTY_VARIANT_SEED };
        }
      }
      return next;
    });
  }, [columns, variantSelections]);

  const deleteRow = useCallback((rowId: string) => {
    setVariantData((prev) => {
      const next: TVariantDataMap = {};
      let removedUuid: string | undefined;
      for (const [key, data] of Object.entries(prev)) {
        const candidateRowId = data.uuid ?? createTmpRowId(key);
        if (candidateRowId === rowId) {
          removedUuid = data.uuid;
          continue;
        }
        next[key] = data;
      }
      if (removedUuid) {
        setRemovedVariantUuids((ids) =>
          ids.includes(removedUuid!) ? ids : [...ids, removedUuid!],
        );
      }
      return next;
    });
  }, []);

  const bulkApply = useCallback(
    (
      rowIds: string[],
      patch: Partial<Pick<TVariant, "price" | "stock" | "available">>,
    ) => {
      if (rowIds.length === 0) return;
      const rowIdSet = new Set(rowIds);
      setVariantData((prev) => {
        const next: TVariantDataMap = { ...prev };
        for (const [key, data] of Object.entries(prev)) {
          const candidateRowId = data.uuid ?? createTmpRowId(key);
          if (!candidateRowId || !rowIdSet.has(candidateRowId)) continue;
          next[key] = { ...data, ...patch };
        }
        return next;
      });
    },
    [],
  );

  const resetRemovedVariantUuids = useCallback(() => {
    setRemovedVariantUuids([]);
  }, []);

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

      // Enforce attribute dimension cap only when adding a brand-new dimension.
      // Create mode uses the hard MAX_ATTRIBUTE_DIMENSIONS; edit mode may
      // receive a higher `attributeCap` for legacy products over the limit so
      // they remain editable (grandfather clause) but cannot grow further.
      if (
        isAdding &&
        !prevActiveAttrs.includes(attribute) &&
        prevActiveAttrs.length >= effectiveCap
      ) {
        return { ok: false as const, reason: "cap" as const };
      }

      const nextColumns = columns
        .filter((col) => nextActiveAttrs.includes(col))
        .concat(nextActiveAttrs.filter((col) => !columns.includes(col)));

      const dimensionChanged =
        prevActiveAttrs.length !== nextActiveAttrs.length;

      let nextVariantData: TVariantDataMap;
      const removedUuids: string[] = [];

      if (dimensionChanged || Object.keys(variantData).length === 0) {
        const cartesian = buildCartesian(nextColumns, nextSelections);
        nextVariantData = {};
        for (const combo of cartesian) {
          if (combo.length === 0) continue;
          const key = createVariantDraftKey(combo);
          nextVariantData[key] = variantData[key] ?? { ...EMPTY_VARIANT_SEED };
        }
        // A dimension transition can only happen for going from 0 actives to
        // 1 (bootstrap) or from 1 to 0 (teardown). In the teardown case all
        // pre-existing rows are discarded; collect their uuids.
        if (!isAdding) {
          for (const [key, data] of Object.entries(variantData)) {
            if (!nextVariantData[key] && data.uuid) {
              removedUuids.push(data.uuid);
            }
          }
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
          } else if (data.uuid) {
            removedUuids.push(data.uuid);
          }
        }
      }

      setVariantSelections(nextSelections);
      setColumns(nextColumns);
      setVariantData(nextVariantData);
      if (removedUuids.length > 0) {
        setRemovedVariantUuids((prev) => {
          const next = [...prev];
          for (const uuid of removedUuids) {
            if (!next.includes(uuid)) next.push(uuid);
          }
          return next;
        });
      }
      return { ok: true as const };
    },
    [
      columns,
      effectiveCap,
      setVariantSelections,
      variantData,
      variantSelections,
    ],
  );

  const toggleValue = useCallback(
    (attribute: string, value: string) => applyToggle(attribute, value),
    [applyToggle],
  );

  const removeValue = useCallback(
    (attribute: string, value: string) => {
      const currentAttrValues = variantSelections[attribute] || [];
      if (!currentAttrValues.includes(value)) return { ok: false as const };
      return applyToggle(attribute, value);
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

  const variantCountByValue = useMemo<
    Record<string, Record<string, number>>
  >(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const row of rows) {
      columns.forEach((col, idx) => {
        const val = row.combo[idx];
        if (!val) return;
        if (!map[col]) map[col] = {};
        map[col][val] = (map[col][val] ?? 0) + 1;
      });
    }
    return map;
  }, [columns, rows]);

  return {
    toggleValue,
    removeValue,
    combinations,
    rows,
    variantData,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
    columns,
    handleReorderColumns,
    setVariantData,
    setColumns,
    addVariant,
    generateMissingCombinations,
    deleteRow,
    bulkApply,
    removedVariantUuids,
    resetRemovedVariantUuids,
    variantCountByValue,
    attributeCap: effectiveCap,
  };
}

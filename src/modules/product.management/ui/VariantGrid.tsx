import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import {
  ProductSubmissionFeedback,
  TImage,
  TVariant,
  TVariantDataMap,
  VariantRow,
} from "@/modules/product.management";
import {
  getSubmissionFieldError,
  hasSubmissionFieldPrefix,
} from "@/modules/product.management/utils/productSubmissionFeedback";
import {
  MAX_FILE_SIZE_MB,
  MAX_VARIANT_IMAGE_COUNT,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { resolveStorageImageUrl } from "@/modules/product.management/utils/imageUrl";
import { validateImage } from "@/modules/product.management/utils/productForm";
import { CirclePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";

type Props = {
  selections: Record<string, string[]>;
  rows: VariantRow[];
  variantData: TVariantDataMap;
  feedback?: ProductSubmissionFeedback | null;
  selectedRowIds: Set<string>;
  onSelectionChange: (next: Set<string>) => void;
  onChange: <K extends keyof TVariant>(
    combo: string[],
    field: K,
    value: TVariant[K],
  ) => void;
  onUpload: (combo: string[], files: FileList) => void;
  onImageRemove: (combo: string[], image: File | string | TImage) => void;
  onDelete: (rowId: string) => void;
  columns: string[];
};

function PreviewImage({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <Image
      width={150}
      height={150}
      src={url}
      alt="variant"
      className="h-14 w-14 border object-cover"
    />
  );
}

function ExistingVariantImage({
  image,
  baseUrl,
}: {
  image: string | TImage;
  baseUrl?: string;
}) {
  const [broken, setBroken] = useState(false);
  const src = resolveStorageImageUrl(image, baseUrl);

  if (broken) {
    return (
      <div className="flex h-14 w-14 items-center justify-center border border-dashed text-center text-[10px] text-muted-foreground">
        Unavailable
      </div>
    );
  }

  return (
    <Image
      width={150}
      height={150}
      src={src}
      alt="variant"
      className="h-14 w-14 border object-cover"
      onError={() => setBroken(true)}
    />
  );
}

export default function VariantGrid({
  selections,
  rows,
  variantData,
  feedback,
  selectedRowIds,
  onSelectionChange,
  onChange,
  onUpload,
  onImageRemove,
  onDelete,
  columns,
}: Props) {
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [pendingDeleteRow, setPendingDeleteRow] = useState<VariantRow | null>(
    null,
  );

  if (rows.length === 0) return null;

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    variant: TVariant,
    combo: string[],
  ) => {
    if (variant.available === false) {
      e.target.value = "";
      return;
    }
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const dedupeKey = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;
    const existingKeys = new Set(
      (variant.images || [])
        .filter((x): x is File => x instanceof File)
        .map(dedupeKey),
    );
    const uniqueIncoming: File[] = [];
    const seen = new Set<string>();
    for (const f of files) {
      const key = dedupeKey(f);
      if (existingKeys.has(key) || seen.has(key)) continue;
      seen.add(key);
      uniqueIncoming.push(f);
    }

    const fileCount = (variant.images?.length || 0) + uniqueIncoming.length;

    if (fileCount > MAX_VARIANT_IMAGE_COUNT) {
      toast.error(
        `Maximum ${MAX_VARIANT_IMAGE_COUNT} images allowed per variant.`,
      );
      e.target.value = "";
      return;
    }

    for (const image of uniqueIncoming) {
      if (image.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`Image exceeds max size of ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = "";
        return;
      }
      const isValidDimension = await validateImage(image);
      if (!isValidDimension) {
        e.target.value = "";
        return;
      }
    }

    const dt = new DataTransfer();
    uniqueIncoming.forEach((f) => dt.items.add(f));

    onUpload(combo, dt.files);
    e.target.value = "";
  };

  const effectiveColumns = columns.length ? columns : Object.keys(selections);
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedRowIds.has(row.rowId));
  const someSelected =
    !allSelected && rows.some((row) => selectedRowIds.has(row.rowId));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(rows.map((row) => row.rowId)));
      return;
    }
    onSelectionChange(new Set());
  };

  const toggleRowSelection = (rowId: string, checked: boolean) => {
    const next = new Set(selectedRowIds);
    if (checked) {
      next.add(rowId);
    } else {
      next.delete(rowId);
    }
    onSelectionChange(next);
  };

  const requestDelete = (row: VariantRow) => {
    if (row.uuid) {
      setPendingDeleteRow(row);
      return;
    }
    onDelete(row.rowId);
  };

  const confirmDelete = () => {
    if (pendingDeleteRow) {
      onDelete(pendingDeleteRow.rowId);
      setPendingDeleteRow(null);
    }
  };

  return (
    <>
      <div className="overflow-auto rounded border">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 w-10 text-center">
                <Checkbox
                  aria-label="Select all variants"
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(value) => toggleSelectAll(value === true)}
                />
              </th>
              {effectiveColumns
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((col) => (
                  <th key={col} className="border px-4 py-2 text-left">
                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                      {col}
                    </div>
                  </th>
                ))}
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Images</th>
              <th className="border px-4 py-2">Availability</th>
              <th className="border px-4 py-2 w-12 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const { rowId, combo, comboKey } = row;
              const variant = variantData[comboKey] ?? {
                stock: "",
                price: "",
                available: true,
                images: [],
                isValid: false,
              };
              const stockError = getSubmissionFieldError(
                feedback ?? null,
                `variants.${idx}.stock`,
              );
              const priceError = getSubmissionFieldError(
                feedback ?? null,
                `variants.${idx}.price`,
              );
              const imagesError = getSubmissionFieldError(
                feedback ?? null,
                `variants.${idx}.images`,
              );
              const variantHasFieldError = hasSubmissionFieldPrefix(
                feedback ?? null,
                `variants.${idx}`,
              );
              const isSelected = selectedRowIds.has(rowId);
              const comboMap = effectiveColumns.reduce(
                (acc, attr, i) => {
                  acc[attr] = combo[i] || "";
                  return acc;
                },
                {} as Record<string, string>,
              );

              return (
                <tr
                  key={rowId}
                  className={cn(
                    variant.available === false && "bg-gray-100 opacity-60",
                    (variant.isValid === false || variantHasFieldError) &&
                      "bg-destructive/5",
                    isSelected && "bg-primary/5",
                  )}
                >
                  <td className="border px-2 py-2 text-center">
                    <Checkbox
                      aria-label={`Select variant ${effectiveColumns
                        .map((col) => comboMap[col])
                        .filter(Boolean)
                        .join(" / ")}`}
                      checked={isSelected}
                      onCheckedChange={(value) =>
                        toggleRowSelection(rowId, value === true)
                      }
                    />
                  </td>
                  {effectiveColumns.map((col, i) => (
                    <td key={col} className="border px-4 py-2">
                      {comboMap[col] || ""}
                    </td>
                  ))}
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="9999"
                      className={cn(
                        "w-20 rounded border px-2 py-1",
                        (stockError || variant.isValid === false) &&
                          "border-destructive",
                      )}
                      value={variant.stock || ""}
                      onChange={(e) => onChange(combo, "stock", e.target.value)}
                    />
                    {stockError && (
                      <p className="mt-1 text-xs text-destructive">{stockError}</p>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      className={cn(
                        "w-20 rounded border px-2 py-1",
                        (priceError || variant.isValid === false) &&
                          "border-destructive",
                      )}
                      value={variant.price || ""}
                      onChange={(e) => onChange(combo, "price", e.target.value)}
                    />
                    {priceError && (
                      <p className="mt-1 text-xs text-destructive">{priceError}</p>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="file"
                      ref={(el) => {
                        imageInputRefs.current[rowId] = el;
                      }}
                      multiple
                      className="hidden"
                      accept="image/*"
                      disabled={variant.available === false}
                      onChange={(e) => handleImageUpload(e, variant, combo)}
                    />
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(variant.images || []).map((img, i) => (
                        <div key={i} className="relative">
                          {img instanceof File ? (
                            <PreviewImage file={img} />
                          ) : (
                            <ExistingVariantImage
                              image={img as string | TImage}
                              baseUrl={variant.image_base_url}
                            />
                          )}
                          <ThemedButton
                            type="button"
                            className="absolute -top-1 -right-1 h-1 w-1 rounded-full border bg-white"
                            disabled={variant.available === false}
                            title={
                              variant.available === false
                                ? "Variant unavailable: cannot delete image"
                                : undefined
                            }
                            aria-disabled={variant.available === false}
                            onClick={() => {
                              if (variant.available === false) return;
                              onImageRemove(combo, img);
                            }}
                          >
                            <FaX className="text-red-600" />
                          </ThemedButton>
                        </div>
                      ))}

                      <div
                        onClick={() => {
                          if (variant.available === false) return;
                          imageInputRefs.current[rowId]?.click();
                        }}
                        title={
                          variant.available === false
                            ? "Variant unavailable: cannot upload images"
                            : undefined
                        }
                        aria-disabled={variant.available === false}
                        className={
                          variant.available === false
                            ? "cursor-not-allowed opacity-60"
                            : undefined
                        }
                      >
                        <CirclePlus width={50} height={50} />
                      </div>
                    </div>
                    {imagesError && (
                      <p className="mt-1 text-xs text-destructive">{imagesError}</p>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <Switch
                      checked={variant.available ?? true}
                      onCheckedChange={(value) =>
                        onChange(combo, "available", value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <ThemedButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete variant ${effectiveColumns
                        .map((col) => comboMap[col])
                        .filter(Boolean)
                        .join(" / ")}`}
                      onClick={() => requestDelete(row)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </ThemedButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={pendingDeleteRow !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteRow(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this variant?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteRow
                ? `This will permanently remove the saved variant ${pendingDeleteRow.combo.join(
                    " / ",
                  )} when you submit. Orders that reference it will not be affected retroactively.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete variant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

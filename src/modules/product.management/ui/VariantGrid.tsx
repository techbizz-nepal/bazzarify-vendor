import { Switch } from "@/components/ui/switch";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import {
  TImage,
  TVariant,
  TVariantDataMap,
} from "@/modules/product.management";
import {
  MAX_FILE_SIZE_MB,
  MAX_VARIANT_IMAGE_COUNT,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { validateImage } from "@/modules/product.management/utils/productForm";
import { createVariantDraftKey } from "@/modules/product.management/utils/variantDraft";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";

type Props = {
  selections: Record<string, string[]>;
  combinations: string[][];
  variantData: TVariantDataMap;
  onChange: <K extends keyof TVariant>(
    combo: string[],
    field: K,
    value: TVariant[K],
  ) => void;
  onUpload: (combo: string[], files: FileList) => void;
  onImageRemove: (combo: string[], image: File | string | TImage) => void;
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

export default function VariantGrid({
  selections,
  combinations,
  variantData,
  onChange,
  onUpload,
  onImageRemove,
  columns,
}: Props) {
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  if (combinations.length === 0) return null;
  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    variant: TVariant,
    combo: string[],
  ) => {
    // Prevent uploads when variant is unavailable
    if (variant.available === false) {
      e.target.value = "";
      return;
    }
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // De-duplicate incoming files against existing variant image files and within the batch
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

    // Validate each file sequentially to ensure size and dimensions are correct
    for (const image of uniqueIncoming) {
      if (image.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`Image exceeds max size of ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = "";
        return;
      }
      const isValidDimension = await validateImage(image);
      if (!isValidDimension) {
        e.target.value = "";
        // validateImage already shows a detailed toast; just stop the upload
        return;
      }
    }

    // Use DataTransfer to pass only the filtered unique files as a FileList
    const dt = new DataTransfer();
    uniqueIncoming.forEach((f) => dt.items.add(f));

    onUpload(combo, dt.files);
    e.target.value = "";
  };
  return (
    <div className="overflow-auto rounded border">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            {(columns.length ? columns : Object.keys(selections))
              .filter((v, i, a) => a.indexOf(v) === i)
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
          </tr>
        </thead>
        <tbody>
          {combinations.map((combo, idx) => {
            const key = createVariantDraftKey(combo);
            const variant = variantData[key] ?? {
              stock: "",
              price: "",
              available: true,
              images: [],
              isValid: false,
            };
            const safeCombo = [...combo];
            while (safeCombo.length < columns.length) safeCombo.push("");

            const attrKeys = columns.length ? columns : Object.keys(selections);
            const comboMap = attrKeys.reduce(
              (acc, attr, i) => {
                acc[attr] = combo[i] || "";
                return acc;
              },
              {} as Record<string, string>,
            );

            return (
              <tr
                key={idx}
                className={`${variant.available === false ? "bg-gray-100 opacity-60" : ""}`}
              >
                {(columns.length || Object.keys(selections).length
                  ? columns.length
                    ? columns
                    : Object.keys(selections)
                  : []
                ).map((_, i) => (
                  <td key={i} className="border px-4 py-2">
                    {comboMap[columns[i]] || ""}
                  </td>
                ))}
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    className="w-20 rounded border px-2 py-1"
                    value={variant.stock || ""}
                    onChange={(e) => onChange(combo, "stock", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="1000000"
                    className="w-20 rounded border px-2 py-1"
                    value={variant.price || ""}
                    onChange={(e) => onChange(combo, "price", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="file"
                    ref={(el) => {
                      const k = createVariantDraftKey(combo);
                      imageInputRefs.current[k] = el;
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
                          <Image
                            width={150}
                            height={150}
                            src={img as string}
                            alt="variant"
                            className="h-14 w-14 border object-cover"
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
                        imageInputRefs.current[createVariantDraftKey(combo)]?.click();
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
                </td>
                <td className="border px-2 py-1 text-center">
                  <Switch
                    checked={variant.available ?? true}
                    onCheckedChange={(value) =>
                      onChange(combo, "available", value)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { Switch } from "@/components/ui/switch";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TVariant, TVariantDataMap } from "@/modules/product.management";
import { MAX_FILE_SIZE_MB } from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { validateImage } from "@/modules/product.management/utils/productForm";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
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
  onImageRemove: (combo: string[], image: File) => void;
  columns: string[];
};

export default function VariantGrid({
  selections,
  combinations,
  variantData,
  onChange,
  onUpload,
  onImageRemove,
  columns,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  if (combinations.length === 0) return null;
  const handleIconClick = () => {
    imageInputRef.current?.click();
  };
  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    variant: TVariant,
    combo: string[],
  ) => {
    if (!e.target.files) return;
    const fileCount = (variant.images?.length || 0) + e.target.files.length;
    const hasTooLargeFile: boolean = Array.from(e.target.files).some(
      async (image) =>
        image.size > MAX_FILE_SIZE_MB * 1024 * 1024 ||
        !(await validateImage(image)),
    );
    const hasInvalidDimension: boolean = Array.from(e.target.files).some(
      async (image) => !(await validateImage(image)),
    );
    if (hasInvalidDimension) return;
    if (hasTooLargeFile) {
      toast.error(`Image exceeds max size of ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    if (fileCount > 3) {
      toast.error("Maximum 3 images allowed per variant.");
      return;
    }
    onUpload(combo, e.target.files);
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
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Images</th>
            <th className="border px-4 py-2">Availability</th>
          </tr>
        </thead>
        <tbody>
          {combinations.map((combo, idx) => {
            const key = combo.join("|");
            const variant = variantData[key] ?? {
              stock: "",
              price: "",
              sku: "",
              available: false,
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
              <tr key={idx}>
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
                    type="text"
                    className="w-28 rounded border px-2 py-1"
                    value={variant.sku || ""}
                    onChange={(e) => onChange(combo, "sku", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="file"
                    ref={imageInputRef}
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, variant, combo)}
                  />
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(variant.images || []).map((img, i) => {
                      const previewUrl =
                        img instanceof File ? URL.createObjectURL(img) : "";
                      return (
                        <div key={i} className="relative">
                          <Image
                            width={150}
                            height={150}
                            src={previewUrl}
                            alt="variant"
                            className="h-14 w-14 border object-cover"
                          />
                          <ThemedButton
                            type="button"
                            className="absolute -top-1 -right-1 h-1 w-1 rounded-full border bg-white"
                            onClick={() => onImageRemove(combo, img)}
                          >
                            <FaX className="text-red-600" />
                          </ThemedButton>
                        </div>
                      );
                    })}

                    <div onClick={handleIconClick}>
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

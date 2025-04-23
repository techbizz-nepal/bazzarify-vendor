import { FaTrashCan } from "react-icons/fa6";
import { VariantData } from "@/modules/product.management";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

type Props = {
  selections: Record<string, string[]>;
  combinations: string[][];
  variantData: Record<string, VariantData>;
  onChange: <K extends keyof VariantData>(
    combo: string[],
    field: K,
    value: VariantData[K],
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
  if (combinations.length === 0) return null;
  return (
    <div className="overflow-auto border rounded">
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
            const variant = variantData[key] || {};
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
                    className="w-20 border px-2 py-1 rounded"
                    value={variant.stock || ""}
                    onChange={(e) => onChange(combo, "stock", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="1000000"
                    className="w-20 border px-2 py-1 rounded"
                    value={variant.price || ""}
                    onChange={(e) => onChange(combo, "price", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-28 border px-2 py-1 rounded"
                    value={variant.sku || ""}
                    onChange={(e) => onChange(combo, "sku", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      const fileCount =
                        (variant.images?.length || 0) + e.target.files.length;
                      if (fileCount > 8) {
                        alert("Maximum 8 images allowed per variant.");
                        return;
                      }
                      onUpload(combo, e.target.files);
                    }}
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(variant.images || []).map((img, i) => {
                      const previewUrl =
                        img instanceof File ? URL.createObjectURL(img) : "";
                      return (
                        <div key={i} className="relative">
                          <Image
                            width={50}
                            height={50}
                            src={previewUrl}
                            alt="variant"
                            className="w-10 h-10 object-cover border"
                          />
                          <ThemedButton
                            type="button"
                            className="absolute -top-1 -right-1 bg-white rounded-full border"
                            onClick={() => onImageRemove(combo, img)}
                          >
                            <FaTrashCan className="h-3 w-3 text-red-600" />
                          </ThemedButton>
                        </div>
                      );
                    })}
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

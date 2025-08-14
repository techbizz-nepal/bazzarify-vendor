import {
  MAX_FILE_SIZE_MB,
  MAX_PRODUCT_IMAGES_COUNT,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { validateImage } from "@/modules/product.management/utils/productForm";
import { CirclePlus, X } from "lucide-react";
import NextImage from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  initialImages?: string[];
}

type PreviewItem = {
  url: string;
  revoke: boolean; // whether this URL is an object URL that should be revoked
};

export default function ImageUploader({
  onImageSelect,
  initialImages = [],
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // When initialImages change, replace previews and revoke any old object URLs
  useEffect(() => {
    if (initialImages.length > 0) {
      // Revoke any existing object URLs before replacing
      previews.forEach((p) => p.revoke && URL.revokeObjectURL(p.url));
      setPreviews(initialImages.map((url) => ({ url, revoke: false })));
      setSelectedFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImages]);

  // Revoke any remaining object URLs on unmount or when previews list changes
  useEffect(() => {
    return () => {
      previews.forEach((p) => p.revoke && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      event.target.value = "";
      return;
    }

    // De-duplicate incoming files against current selection and within batch
    const fileArray = Array.from(files);
    const dedupeKey = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;
    const existingKeys = new Set(selectedFiles.map(dedupeKey));
    const uniqueIncoming: File[] = [];
    const seen = new Set<string>();
    for (const f of fileArray) {
      const key = dedupeKey(f);
      if (existingKeys.has(key) || seen.has(key)) continue;
      seen.add(key);
      uniqueIncoming.push(f);
    }

    const newValidFiles: File[] = [];
    const newPreviews: PreviewItem[] = [];

    for (const file of uniqueIncoming) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(
          `File ${file.name} exceeds max size of ${MAX_FILE_SIZE_MB}MB.`,
        );
        continue;
      }

      const isValid = await validateImage(file);
      if (!isValid) continue;

      const url = URL.createObjectURL(file);
      newValidFiles.push(file);
      newPreviews.push({ url, revoke: true });
    }

    if (previews.length + newPreviews.length > MAX_PRODUCT_IMAGES_COUNT) {
      toast.error(
        `Maximum ${MAX_PRODUCT_IMAGES_COUNT} images allowed per product.`,
      );
      event.target.value = "";
      // Revoke newly created URLs since we are discarding them
      newPreviews.forEach((p) => p.revoke && URL.revokeObjectURL(p.url));
      return;
    }
    if (newValidFiles.length === 0) {
      // Nothing added; still reset so picking the same file retriggers change
      event.target.value = "";
      return;
    }

    const updatedPreviews = [...previews, ...newPreviews];
    const updatedFiles = [...selectedFiles, ...newValidFiles];

    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    onImageSelect(updatedFiles);
    // Clear after success so re-selecting the same file triggers onChange
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const toRemove = previews[index];
    if (toRemove?.revoke) URL.revokeObjectURL(toRemove.url);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onImageSelect(newFiles);
  };

  return (
    <div className="flex items-center space-x-4 ">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-wrap gap-4">
        {previews.map((p, index) => (
          <div key={index} className="relative">
            <NextImage
              width={100}
              height={100}
              src={p.url}
              alt={`preview-${index}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
      <div onClick={handleIconClick}>
        <CirclePlus width={80} height={80} />
      </div>
    </div>
  );
}

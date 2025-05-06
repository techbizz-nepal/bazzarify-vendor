import { CirclePlus, X } from "lucide-react";
import NextImage from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  initialImages?: string[];
}

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 3;
const MIN_DIMENSION = 330;
const MAX_DIMENSION = 5000;

export default function ImageUpload({
  onImageSelect,
  initialImages = [],
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (initialImages.length > 0) {
      setPreviews(initialImages);
      setSelectedFiles([]);
    }
  }, [initialImages]);

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (
          img.width < MIN_DIMENSION ||
          img.height < MIN_DIMENSION ||
          img.width > MAX_DIMENSION ||
          img.height > MAX_DIMENSION
        ) {
          toast.error(
            `Image dimensions must be between ${MIN_DIMENSION}x${MIN_DIMENSION} and ${MAX_DIMENSION}x${MAX_DIMENSION}px.`,
          );
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newValidFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(
          `File ${file.name} exceeds max size of ${MAX_FILE_SIZE_MB}MB.`,
        );
        continue;
      }

      const isValid = await validateImage(file);
      if (!isValid) continue;

      newValidFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (previews.length + newPreviews.length > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const updatedPreviews = [...previews, ...newPreviews];
    const updatedFiles = [...selectedFiles, ...newValidFiles];

    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    onImageSelect(updatedFiles);
  };

  const handleRemoveImage = (index: number) => {
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
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <NextImage
              width={100}
              height={100}
              src={src}
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

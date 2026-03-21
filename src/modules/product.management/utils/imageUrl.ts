import { TImage } from "@/modules/product.management";

const isAbsoluteUrl = (value: string) => /^(https?:)?\/\//.test(value);

export const resolveStorageImageUrl = (
  image: string | TImage,
  baseUrl?: string | null,
): string => {
  const file = typeof image === "string" ? image : image.file;

  if (isAbsoluteUrl(file)) {
    return file;
  }

  const normalizedBaseUrl = (baseUrl || "").replace(/\/+$/, "");
  const normalizedFile = String(file).replace(/^\/+/, "");

  if (!normalizedBaseUrl) {
    return normalizedFile;
  }

  return `${normalizedBaseUrl}/${normalizedFile}`;
};

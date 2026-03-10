const DEFAULT_VENDOR_PRODUCT_PATH = "/products";

export const sanitizeVendorReturnPath = (
  value: string | null | undefined,
  fallback = DEFAULT_VENDOR_PRODUCT_PATH,
) => {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
};

export const buildStoreRequirementPath = (returnTo: string) => {
  const params = new URLSearchParams({
    returnTo: sanitizeVendorReturnPath(returnTo),
  });

  return `/store-required?${params.toString()}`;
};

export const DEFAULT_STORE_REQUIREMENT_RETURN_PATH =
  DEFAULT_VENDOR_PRODUCT_PATH;

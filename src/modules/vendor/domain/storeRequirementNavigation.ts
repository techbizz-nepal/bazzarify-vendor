const DEFAULT_VENDOR_PRODUCT_PATH = "/products";
export const STORE_CREATED_SUCCESS_PATH = "/store-created";
export const STORE_REMEDIATION_PATH = "/store-remediation";

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

export const buildStoreRemediationPath = (returnTo?: string | null) => {
  const safeReturnTo = returnTo
    ? sanitizeVendorReturnPath(returnTo)
    : null;

  if (!safeReturnTo) {
    return STORE_REMEDIATION_PATH;
  }

  const params = new URLSearchParams({
    returnTo: safeReturnTo,
  });

  return `${STORE_REMEDIATION_PATH}?${params.toString()}`;
};

export const DEFAULT_STORE_REQUIREMENT_RETURN_PATH =
  DEFAULT_VENDOR_PRODUCT_PATH;

export const resolvePostStoreCreationPath = (
  returnTo?: string | null,
) => {
  if (!returnTo) {
    return STORE_CREATED_SUCCESS_PATH;
  }

  return sanitizeVendorReturnPath(returnTo);
};

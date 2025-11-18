export const REDIS_VENDOR_KEY_PREFIX = "vendor_";
export const vendorPrefixedKey = (key: string) =>
  REDIS_VENDOR_KEY_PREFIX.concat(key);

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str; // Handle empty or non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

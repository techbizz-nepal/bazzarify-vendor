export function toTitleCase(str: string) {
  if (!str) {
    return ""; // Handle empty or null strings
  }
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getJsonOrString(value: string | null) {
  if (!value) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

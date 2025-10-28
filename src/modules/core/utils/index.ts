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

export function getSubDomain(url: string): string {
  return url;
}

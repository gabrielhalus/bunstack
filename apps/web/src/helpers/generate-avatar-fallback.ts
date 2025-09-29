export function generateAvatarFallback(name?: string | null): string {
  if (!name || typeof name !== "string")
    return "?";

  // Allow Unicode letters, numbers, and spaces
  const cleanedName = name
    .trim()
    .replace(/[^\p{L}\p{N}\s]+/gu, "") // remove anything that's not letter, number, or space
    .replace(/\s+/g, " "); // normalize whitespace

  if (cleanedName.length === 0)
    return "?";

  const parts = cleanedName.split(" ");

  if (parts.length === 1) {
    const firstPart = parts[0];
    return firstPart?.slice(0, 2).toUpperCase() || "?";
  }

  const firstInitial = parts[0]?.[0];
  const secondInitial = parts[1]?.[0];

  if (!firstInitial || !secondInitial)
    return "?";

  return (firstInitial + secondInitial).toUpperCase();
}

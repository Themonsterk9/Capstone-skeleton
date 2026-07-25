/**
 * Combines multiple class names into a single string.
 * @param {...(string|boolean|undefined|null)} inputs - List of class names or conditional values.
 * @returns {string} - Merged class names string.
 */
export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(" ");
}

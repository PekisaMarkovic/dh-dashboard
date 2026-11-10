export const extractFirstLetters = (str: string): string => {
  return str
    .split(' ')
    .filter((word) => word.length > 0) // Remove empty strings (e.g., double spaces)
    .map((word) => word[0].toUpperCase()) // Take the first letter of each word
    .join('')
}

export const normalizeSpaces = (str = ''): string => {
  return str.trim().replace(/\s+/g, ' ')
}

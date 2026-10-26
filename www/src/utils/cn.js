/**
 * Lightweight classNames combiner utility
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
}

export default cn;

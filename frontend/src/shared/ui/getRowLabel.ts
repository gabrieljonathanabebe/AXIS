/**
 * Names one row of a control group; a prefix tells two groups of one
 * widget apart.
 * @param name Row name, e.g. "Color".
 * @param prefix Group the row belongs to, e.g. "Title".
 * @returns "Color" without prefix, "Title color" with it.
 */
export function getRowLabel(name: string, prefix?: string): string {
  return prefix ? `${prefix} ${name.toLowerCase()}` : name
}

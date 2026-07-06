export function normalizeIconSize(size: number | string | undefined): string | undefined {
  if (size == null || size === '') return undefined
  if (typeof size === 'number') return `${size}px`

  const value = size.trim()
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : size
}

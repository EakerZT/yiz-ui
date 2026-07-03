export type DateTimeValue = Date | string | null

export interface DateTimeParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function splitDateTimeFormat(format: string) {
  const timeIndex = format.search(/[Hms]/)
  if (timeIndex < 0) {
    return { dateFormat: format, timeFormat: 'HH:mm:ss' }
  }
  return {
    dateFormat: format.slice(0, timeIndex).replace(/[\sT]+$/, '') || 'YYYY-MM-DD',
    timeFormat: format.slice(timeIndex) || 'HH:mm:ss',
  }
}

export function formatDateTime(date: Date, format: string): string {
  const map: Record<string, string> = {
    YYYY: `${date.getFullYear()}`,
    yyyy: `${date.getFullYear()}`,
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    dd: pad(date.getDate()),
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    d: `${date.getDate()}`,
    HH: pad(date.getHours()),
    H: `${date.getHours()}`,
    mm: pad(date.getMinutes()),
    m: `${date.getMinutes()}`,
    ss: pad(date.getSeconds()),
    s: `${date.getSeconds()}`,
  }
  return format.replace(/YYYY|yyyy|MM|DD|dd|HH|mm|ss|M|D|d|H|m|s/g, (key) => map[key] || key)
}

export function parseDateTime(value: string, format: string): Date | null {
  const tokenPattern = /YYYY|yyyy|MM|DD|dd|HH|mm|ss|M|D|d|H|m|s/g
  const tokenMap: Record<string, string> = {
    YYYY: '(\\d{4})',
    yyyy: '(\\d{4})',
    MM: '(\\d{2})',
    M: '(\\d{1,2})',
    DD: '(\\d{2})',
    dd: '(\\d{2})',
    D: '(\\d{1,2})',
    d: '(\\d{1,2})',
    HH: '(\\d{2})',
    H: '(\\d{1,2})',
    mm: '(\\d{2})',
    m: '(\\d{1,2})',
    ss: '(\\d{2})',
    s: '(\\d{1,2})',
  }
  const tokens: string[] = []
  let pattern = ''
  let lastIndex = 0
  for (const match of format.matchAll(tokenPattern)) {
    pattern += escapeRegExp(format.slice(lastIndex, match.index))
    pattern += tokenMap[match[0]]
    tokens.push(match[0])
    lastIndex = (match.index ?? 0) + match[0].length
  }
  pattern += escapeRegExp(format.slice(lastIndex))

  const matched = new RegExp(`^${pattern}$`).exec(value)
  if (!matched) return null

  const parts: Partial<DateTimeParts> = { hour: 0, minute: 0, second: 0 }
  tokens.forEach((token, index) => {
    const num = Number(matched[index + 1])
    if (token === 'YYYY' || token === 'yyyy') parts.year = num
    if (token === 'MM' || token === 'M') parts.month = num
    if (token === 'DD' || token === 'dd' || token === 'D' || token === 'd') parts.day = num
    if (token === 'HH' || token === 'H') parts.hour = num
    if (token === 'mm' || token === 'm') parts.minute = num
    if (token === 'ss' || token === 's') parts.second = num
  })
  if (parts.year == null || parts.month == null || parts.day == null) return null
  if (parts.hour! < 0 || parts.hour! > 23) return null
  if (parts.minute! < 0 || parts.minute! > 59) return null
  if (parts.second! < 0 || parts.second! > 59) return null

  const date = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  if (date.getFullYear() !== parts.year || date.getMonth() !== parts.month - 1 || date.getDate() !== parts.day) {
    return null
  }
  return date
}

export function parseDateTimeValue(value: DateTimeValue | undefined, format: string): Date | null {
  if (value == null) return null
  if (value instanceof Date) return new Date(value.getTime())
  return parseDateTime(value, format)
}

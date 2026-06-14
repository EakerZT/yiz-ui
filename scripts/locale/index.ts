import { ref } from 'vue'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

type MessageValue = string | string[]
export type Lang = string
export type LangMessages = Record<string, MessageValue>

const messages: Record<Lang, LangMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const currentLang = ref<Lang>('zh-CN')

export function setLang(lang: Lang) {
  currentLang.value = messages[lang] ? lang : 'zh-CN'
}

export function registerLang(lang: Lang, langObject: LangMessages = {}) {
  messages[lang] = { ...langObject }
}

export function registerLangItem(lang: Lang, itemObject: LangMessages) {
  messages[lang] = {
    ...(messages[lang] ?? {}),
    ...itemObject
  }
}

export function t(key: string, params: Record<string, string | number> = {}): string {
  const value = (messages[currentLang.value] as Record<string, MessageValue>)[key]
  const fallback = (messages['zh-CN'] as Record<string, MessageValue>)[key]
  const text = Array.isArray(value) ? value.join(',') : value ?? fallback ?? key
  return String(text).replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`))
}

export function tList(key: string): string[] {
  const value = (messages[currentLang.value] as Record<string, MessageValue>)[key]
  const fallback = (messages['zh-CN'] as Record<string, MessageValue>)[key]
  if (Array.isArray(value)) return value
  if (Array.isArray(fallback)) return fallback
  return []
}

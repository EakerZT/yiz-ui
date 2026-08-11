import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

type MessageValue = string | string[]
export type Lang = string
export type LangMessages = Record<string, MessageValue>

const messages: Record<Lang, LangMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const currentLang = ref<Lang>('zh-CN')
export const localeContextKey: InjectionKey<Ref<Lang>> = Symbol('yizLocale')

export interface Translate {
  (key: string, params?: Record<string, string | number>): string
  list: (key: string) => string[]
}

export function registerLang(lang: Lang, langObject: LangMessages = {}) {
  messages[lang] = { ...langObject }
}

export function registerLangItem(lang: Lang, itemObject: LangMessages) {
  messages[lang] = {
    ...(messages[lang] ?? {}),
    ...itemObject,
  }
}

export function provideLocale(locale: Ref<Lang>) {
  provide(localeContextKey, locale)
}

export function useLocale(): Translate {
  return createTranslator(inject(localeContextKey, currentLang))
}

export function useLocaleRef(): Ref<Lang> {
  return inject(localeContextKey, currentLang)
}

export function createTranslator(locale: Ref<Lang> = currentLang): Translate {
  const t = ((key: string, params: Record<string, string | number> = {}) =>
    translate(locale.value, key, params)) as Translate
  t.list = (key: string) => translateList(locale.value, key)
  return t
}

function translate(lang: Lang, key: string, params: Record<string, string | number> = {}): string {
  const value = (messages[lang] as Record<string, MessageValue> | undefined)?.[key]
  const fallback = (messages['zh-CN'] as Record<string, MessageValue>)[key]
  const text = Array.isArray(value) ? value.join(',') : (value ?? fallback ?? key)
  return String(text).replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`))
}

function translateList(lang: Lang, key: string): string[] {
  const value = (messages[lang] as Record<string, MessageValue> | undefined)?.[key]
  const fallback = (messages['zh-CN'] as Record<string, MessageValue>)[key]
  if (Array.isArray(value)) return value
  if (Array.isArray(fallback)) return fallback
  return []
}

import { mostReadable, TinyColor } from '@ctrl/tinycolor'
import { computed, inject, type ComputedRef, type CSSProperties, type InjectionKey } from 'vue'
import type { InputSize, InputStyleMode } from '../input-style'

export interface ThemeColors {
  primary: string
  success: string
  warning: string
  error: string
  bg: string
  bgContainer: string
  bgElevated: string
  bgMuted: string
  bgSubtle: string
  bgActive: string
  bgRowHover: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textDisabled: string
  textInverse: string
  border: string
  borderLight: string
  borderSubtle: string
  mask: string
  hoverBg: string
  controlFilledBg: string
  controlFilledHoverBg: string
  loadingMask: string
  tooltipBg: string
  tooltipText: string
  scrollThumb: string
  scrollThumbHover: string
  scrollThumbActive: string
}

export interface ThemeTypography {
  fontSizeSmall: string
  fontSizeDefault: string
  fontSizeLarge: string
  fontSizeTitle: string
  fontWeightRegular: number
  fontWeightMedium: number
  fontWeightSemibold: number
  lineHeightCompact: number
  lineHeightDefault: number
}

export interface ThemeSizing {
  controlHeightSmall: string
  controlHeightDefault: string
  controlHeightLarge: string
  controlPaddingXSmall: string
  controlPaddingXDefault: string
  controlPaddingXLarge: string
}

export interface ThemeRadius {
  small: string
  default: string
  large: string
  container: string
  round: string
}

export interface ThemeMotion {
  durationFast: string
  durationDefault: string
  durationSlow: string
  easingStandard: string
}

export type InputNumberControls = 'left' | 'right' | 'separate' | 'none'

export interface ThemeInputNumber {
  controls: InputNumberControls
}

export interface Theme {
  darkMode: boolean
  size: InputSize
  styleMode: InputStyleMode
  inputNumber: ThemeInputNumber
  colors: ThemeColors
  typography: ThemeTypography
  sizing: ThemeSizing
  radius: ThemeRadius
  motion: ThemeMotion
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface ColorRoles {
  base: string
  hover: string
  active: string
  disabled: string
  bg: string
  bgHover: string
  border: string
  text: string
  onColor: string
}

export type ThemeColorName = 'primary' | 'success' | 'warning' | 'error'
export type ThemeColorRoles = Record<ThemeColorName, ColorRoles>

const defaultSharedTheme = {
  size: 'default',
  styleMode: 'outlined',
  inputNumber: {
    controls: 'right',
  },
  typography: {
    fontSizeSmall: '12px',
    fontSizeDefault: '14px',
    fontSizeLarge: '16px',
    fontSizeTitle: '18px',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    lineHeightCompact: 1.4,
    lineHeightDefault: 1.6,
  },
  sizing: {
    controlHeightSmall: '24px',
    controlHeightDefault: '32px',
    controlHeightLarge: '40px',
    controlPaddingXSmall: '10px',
    controlPaddingXDefault: '14px',
    controlPaddingXLarge: '18px',
  },
  radius: {
    small: '2px',
    default: '4px',
    large: '6px',
    container: '8px',
    round: '9999px',
  },
  motion: {
    durationFast: '0.15s',
    durationDefault: '0.2s',
    durationSlow: '0.3s',
    easingStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} satisfies Pick<Theme, 'size' | 'styleMode' | 'inputNumber' | 'typography' | 'sizing' | 'radius' | 'motion'>

export const lightTheme: Readonly<Theme> = deepFreeze({
  ...defaultSharedTheme,
  darkMode: false,
  colors: {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    bg: '#ffffff',
    bgContainer: '#ffffff',
    bgElevated: '#ffffff',
    bgMuted: '#f5f5f5',
    bgSubtle: '#fafafa',
    bgActive: '#f0f2f5',
    bgRowHover: '#f5f7fa',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textDisabled: '#c0c4cc',
    textInverse: '#ffffff',
    border: '#d9d9d9',
    borderLight: '#e4e7ed',
    borderSubtle: '#f0f2f5',
    mask: 'rgba(0, 0, 0, 0.45)',
    hoverBg: 'rgba(0, 0, 0, 0.06)',
    controlFilledBg: 'rgba(0, 0, 0, 0.04)',
    controlFilledHoverBg: 'rgba(0, 0, 0, 0.06)',
    loadingMask: 'rgba(255, 255, 255, 0.72)',
    tooltipBg: '#303133',
    tooltipText: '#ffffff',
    scrollThumb: 'rgba(0, 0, 0, 0.18)',
    scrollThumbHover: 'rgba(0, 0, 0, 0.32)',
    scrollThumbActive: 'rgba(0, 0, 0, 0.45)',
  },
})

export const darkTheme: Readonly<Theme> = deepFreeze({
  ...defaultSharedTheme,
  darkMode: true,
  colors: {
    primary: '#4096ff',
    success: '#49aa19',
    warning: '#d89614',
    error: '#d84a4c',
    bg: '#101014',
    bgContainer: '#18181d',
    bgElevated: '#202027',
    bgMuted: '#26262e',
    bgSubtle: '#141419',
    bgActive: '#303039',
    bgRowHover: '#24242b',
    textPrimary: 'rgba(255, 255, 255, 0.88)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textTertiary: 'rgba(255, 255, 255, 0.45)',
    textDisabled: 'rgba(255, 255, 255, 0.3)',
    textInverse: '#ffffff',
    border: '#42424b',
    borderLight: '#35353d',
    borderSubtle: '#2b2b32',
    mask: 'rgba(0, 0, 0, 0.65)',
    hoverBg: 'rgba(255, 255, 255, 0.08)',
    controlFilledBg: 'rgba(255, 255, 255, 0.06)',
    controlFilledHoverBg: 'rgba(255, 255, 255, 0.1)',
    loadingMask: 'rgba(16, 16, 20, 0.72)',
    tooltipBg: '#f0f0f0',
    tooltipText: '#202027',
    scrollThumb: 'rgba(255, 255, 255, 0.18)',
    scrollThumbHover: 'rgba(255, 255, 255, 0.32)',
    scrollThumbActive: 'rgba(255, 255, 255, 0.45)',
  },
})

export function defineTheme(base: Theme = lightTheme, overrides: DeepPartial<Theme> = {}): Theme {
  return mergeTheme(base, overrides)
}

export function mergeTheme(base: Theme, overrides: DeepPartial<Theme>): Theme {
  return {
    ...base,
    ...overrides,
    inputNumber: { ...base.inputNumber, ...overrides.inputNumber },
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    sizing: { ...base.sizing, ...overrides.sizing },
    radius: { ...base.radius, ...overrides.radius },
    motion: { ...base.motion, ...overrides.motion },
  }
}

export function deriveColorRoles(color: string, theme: Pick<Theme, 'darkMode' | 'colors'>): ColorRoles {
  const base = normalizeColor(color, theme.colors.primary)
  const surface = theme.colors.bgContainer
  const baseColor = new TinyColor(base)
  const surfaceColor = new TinyColor(surface)

  if (theme.darkMode) {
    return {
      base,
      hover: baseColor.tint(18).toHexString(),
      active: baseColor.shade(15).toHexString(),
      disabled: surfaceColor.mix(base, 42).toHexString(),
      bg: surfaceColor.mix(base, 18).toHexString(),
      bgHover: surfaceColor.mix(base, 26).toHexString(),
      border: surfaceColor.mix(base, 45).toHexString(),
      text: baseColor.tint(18).toHexString(),
      onColor: readableText(base, theme.colors.textInverse, theme.colors.textPrimary),
    }
  }

  return {
    base,
    hover: baseColor.tint(20).toHexString(),
    active: baseColor.shade(10).toHexString(),
    disabled: surfaceColor.mix(base, 48).toHexString(),
    bg: surfaceColor.mix(base, 10).toHexString(),
    bgHover: surfaceColor.mix(base, 18).toHexString(),
    border: surfaceColor.mix(base, 28).toHexString(),
    text: baseColor.shade(10).toHexString(),
    onColor: readableText(base, theme.colors.textInverse, theme.colors.textPrimary),
  }
}

export function generateThemeColorRoles(theme: Theme): ThemeColorRoles {
  return {
    primary: deriveColorRoles(theme.colors.primary, theme),
    success: deriveColorRoles(theme.colors.success, theme),
    warning: deriveColorRoles(theme.colors.warning, theme),
    error: deriveColorRoles(theme.colors.error, theme),
  }
}

export function themeToCssVars(theme: Theme): CSSProperties {
  const roles = generateThemeColorRoles(theme)
  const vars: Record<string, string | number> = {
    colorScheme: theme.darkMode ? 'dark' : 'light',
    '--yiz-color-bg': theme.colors.bg,
    '--yiz-color-bg-container': theme.colors.bgContainer,
    '--yiz-color-bg-elevated': theme.colors.bgElevated,
    '--yiz-color-bg-muted': theme.colors.bgMuted,
    '--yiz-color-bg-subtle': theme.colors.bgSubtle,
    '--yiz-color-bg-active': theme.colors.bgActive,
    '--yiz-color-bg-row-hover': theme.colors.bgRowHover,
    '--yiz-color-text-primary': theme.colors.textPrimary,
    '--yiz-color-text-secondary': theme.colors.textSecondary,
    '--yiz-color-text-tertiary': theme.colors.textTertiary,
    '--yiz-color-text-disabled': theme.colors.textDisabled,
    '--yiz-color-text-inverse': theme.colors.textInverse,
    '--yiz-color-border': theme.colors.border,
    '--yiz-color-border-light': theme.colors.borderLight,
    '--yiz-color-border-subtle': theme.colors.borderSubtle,
    '--yiz-color-mask': theme.colors.mask,
    '--yiz-color-hover-bg': theme.colors.hoverBg,
    '--yiz-control-filled-bg': theme.colors.controlFilledBg,
    '--yiz-control-filled-hover-bg': theme.colors.controlFilledHoverBg,
    '--yiz-color-loading-mask': theme.colors.loadingMask,
    '--yiz-color-tooltip-bg': theme.colors.tooltipBg,
    '--yiz-color-tooltip-text': theme.colors.tooltipText,
    '--yiz-scroll-thumb-bg': theme.colors.scrollThumb,
    '--yiz-scroll-thumb-bg-hover': theme.colors.scrollThumbHover,
    '--yiz-scroll-thumb-bg-active': theme.colors.scrollThumbActive,
    '--yiz-control-focus-shadow': `0 0 0 2px ${new TinyColor(theme.colors.primary).setAlpha(0.16).toRgbString()}`,
    '--yiz-control-error-focus-shadow': `0 0 0 2px ${new TinyColor(theme.colors.error).setAlpha(0.16).toRgbString()}`,
    '--yiz-focus-ring-color': new TinyColor(theme.colors.primary).setAlpha(0.4).toRgbString(),
    '--yiz-font-size-small': theme.typography.fontSizeSmall,
    '--yiz-font-size-default': theme.typography.fontSizeDefault,
    '--yiz-font-size-large': theme.typography.fontSizeLarge,
    '--yiz-font-size-title': theme.typography.fontSizeTitle,
    '--yiz-font-weight-regular': theme.typography.fontWeightRegular,
    '--yiz-font-weight-medium': theme.typography.fontWeightMedium,
    '--yiz-font-weight-semibold': theme.typography.fontWeightSemibold,
    '--yiz-line-height-compact': theme.typography.lineHeightCompact,
    '--yiz-line-height-default': theme.typography.lineHeightDefault,
    '--yiz-control-height-small': theme.sizing.controlHeightSmall,
    '--yiz-control-height-default': theme.sizing.controlHeightDefault,
    '--yiz-control-height-large': theme.sizing.controlHeightLarge,
    '--yiz-control-padding-x-small': theme.sizing.controlPaddingXSmall,
    '--yiz-control-padding-x-default': theme.sizing.controlPaddingXDefault,
    '--yiz-control-padding-x-large': theme.sizing.controlPaddingXLarge,
    '--yiz-radius-small': theme.radius.small,
    '--yiz-radius-default': theme.radius.default,
    '--yiz-radius-large': theme.radius.large,
    '--yiz-radius-container': theme.radius.container,
    '--yiz-radius-round': theme.radius.round,
    '--yiz-motion-duration-fast': theme.motion.durationFast,
    '--yiz-motion-duration-default': theme.motion.durationDefault,
    '--yiz-motion-duration-slow': theme.motion.durationSlow,
    '--yiz-motion-easing-standard': theme.motion.easingStandard,
  }

  for (const name of ['primary', 'success', 'warning', 'error'] as const) {
    const color = roles[name]
    vars[`--yiz-color-${name}`] = color.base
    vars[`--yiz-color-${name}-hover`] = color.hover
    vars[`--yiz-color-${name}-active`] = color.active
    vars[`--yiz-color-${name}-disabled`] = color.disabled
    vars[`--yiz-color-${name}-bg`] = color.bg
    vars[`--yiz-color-${name}-bg-hover`] = color.bgHover
    vars[`--yiz-color-${name}-border`] = color.border
    vars[`--yiz-color-${name}-text`] = color.text
    vars[`--yiz-color-on-${name}`] = color.onColor
  }

  return vars as CSSProperties
}

export interface ThemeContext {
  theme: ComputedRef<Theme>
  cssVars: ComputedRef<CSSProperties>
}

export const themeContextKey: InjectionKey<ThemeContext> = Symbol('yizTheme')
const fallbackTheme = computed(() => lightTheme as Theme)
const fallbackThemeContext: ThemeContext = {
  theme: fallbackTheme,
  cssVars: computed(() => themeToCssVars(fallbackTheme.value)),
}

export function useTheme(): ThemeContext {
  return inject(themeContextKey, fallbackThemeContext)
}

export function useThemeSize(getSize: () => InputSize | undefined) {
  const { theme } = useTheme()
  return computed(() => getSize() ?? theme.value.size)
}

export function useThemeInputStyleMode(getStyleMode: () => InputStyleMode | undefined) {
  const { theme } = useTheme()
  return computed(() => getStyleMode() ?? theme.value.styleMode)
}

function normalizeColor(color: string, fallback: string): string {
  const value = new TinyColor(color)
  return value.isValid ? value.toHexString() : new TinyColor(fallback).toHexString()
}

function readableText(background: string, light: string, dark: string): string {
  return (
    mostReadable(background, [light, dark], { includeFallbackColors: true }) ?? new TinyColor(light)
  ).toHexString()
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach((item) => deepFreeze(item))
  }
  return value
}

import { useTheme } from '@/shared/theme/ThemeProvider'

/**
 * Chart palettes validated with the six-checks palette validator against
 * white (#FFFFFF) and dark (#101E24) chart surfaces:
 *   light: #0E9488 / #C94236 / #B97D1E — all checks pass
 *   dark:  #12A093 / #DA6055 / #BE8434 — all checks pass
 */
export interface ChartPalette {
  primary: string
  danger: string
  gold: string
  grid: string
  axis: string
  surface: string
}

const light: ChartPalette = {
  primary: '#0E9488',
  danger: '#C94236',
  gold: '#B97D1E',
  grid: '#E2E9E9',
  axis: '#7D939C',
  surface: '#FFFFFF',
}

const dark: ChartPalette = {
  primary: '#12A093',
  danger: '#DA6055',
  gold: '#BE8434',
  grid: '#1D3138',
  axis: '#63797F',
  surface: '#101E24',
}

export function useChartPalette(): ChartPalette {
  const { isDark } = useTheme()
  return isDark ? dark : light
}

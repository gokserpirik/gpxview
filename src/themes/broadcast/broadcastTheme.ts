import { defineTheme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral'

export const broadcastTheme = defineTheme({
  name: 'broadcast',
  extends: neutralTheme,
  tokens: {
    '--color-accent': ['#c5232e', '#e03a44'],
    '--color-on-accent': '#ffffff',
    '--color-background-body': ['#111114', '#111114'],
    '--color-background-surface': ['#1c1c20', '#1c1c20'],
    '--color-text-primary': ['#f5f5f3', '#f5f5f3'],
    '--color-text-secondary': ['#b6b6b9', '#b6b6b9'],
    '--color-border': ['#38383e', '#38383e'],
  },
  localTokens: {
    '--color-speed-slow': '#ffd500',
    '--color-speed-medium': '#00e030',
    '--color-speed-fast': '#a200ff',
  },
})

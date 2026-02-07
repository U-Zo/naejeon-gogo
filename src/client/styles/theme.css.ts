import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    // Background
    bgPrimary: '#010a13',
    bgSecondary: '#0a1428',
    bgCard: '#0a1a2e',
    bgHover: '#1a2a40',
    bgInput: '#0d1f33',

    // Gold accent (LoL signature)
    gold: '#c8aa6e',
    goldLight: '#f0e6d2',
    goldDark: '#785a28',

    // Blue accent
    blue: '#0397ab',
    blueLight: '#0ac8b9',
    blueDark: '#005a82',

    // Text
    textPrimary: '#f0e6d2',
    textSecondary: '#a09b8c',
    textMuted: '#5b5a56',

    // Team colors
    teamA: '#4a90d9',
    teamB: '#d94a4a',

    // Status
    success: '#1db954',
    error: '#e04040',
    warning: '#f0b232',

    // Border
    border: '#1e2d3d',
    borderGold: '#785a28',
  },
  font: {
    body: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSize: {
    xs: '0.8125rem',
    sm: '0.9375rem',
    md: '1.0625rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.75rem',
  },
  space: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    '2xl': '40px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
});

// src/theme/index.js

export const COLORS = {
  // Dark theme
  dark: {
    bg:          '#080e1a',
    surface:     '#0d1929',
    surfaceHigh: '#1a2744',
    border:      'rgba(255,255,255,0.07)',
    borderAccent:'rgba(0,245,160,0.4)',
    text:        '#e2e8f0',
    textSub:     '#a0aec0',
    textMuted:   '#718096',
    accent:      '#00f5a0',
    accentRed:   '#ff5252',
    accentBlue:  '#60a5fa',
    accentYellow:'#f59e0b',
    accentPurple:'#a78bfa',
    accentCyan:  '#00d9f5',
    navBg:       '#080e1a',
    card:        'rgba(14,22,36,0.98)',
    ringSub:     '#1e2a3a',
    inputBg:     'rgba(255,255,255,0.05)',
    skeleton:    '#1a2744',
  },
  // Light theme
  light: {
    bg:          '#f0f4f8',
    surface:     '#ffffff',
    surfaceHigh: '#e8eef5',
    border:      'rgba(0,0,0,0.08)',
    borderAccent:'rgba(0,160,100,0.4)',
    text:        '#1a202c',
    textSub:     '#4a5568',
    textMuted:   '#718096',
    accent:      '#00a86b',
    accentRed:   '#e53e3e',
    accentBlue:  '#3b82f6',
    accentYellow:'#d97706',
    accentPurple:'#7c3aed',
    accentCyan:  '#0891b2',
    navBg:       '#ffffff',
    card:        '#ffffff',
    ringSub:     '#e2e8f0',
    inputBg:     'rgba(0,0,0,0.04)',
    skeleton:    '#e2e8f0',
  },
};

export const FONTS = {
  mono:       'Courier New',
  monoBold:   'Courier New',
  sans:       'System',
  sansBold:   'System',
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const RADIUS = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
};

export const COLORS = {
  primary: '#FF6B9D',
  primaryLight: '#FFB3CC',
  primaryDark: '#E0447A',
  secondary: '#C77DFF',
  secondaryLight: '#E4AAFF',
  accent: '#FF9A3C',

  background: '#FFF0F3',
  backgroundSecondary: '#FFF5F8',
  card: '#FFFFFF',
  cardBorder: '#FFE0EB',

  text: '#2D1B2E',
  textSecondary: '#7A5C6E',
  textTertiary: '#B89BAA',
  textLight: '#FFFFFF',

  success: '#63E6BE',
  warning: '#FFD43B',
  error: '#FF6B6B',
  info: '#74C0FC',

  border: '#F0D9E3',
  divider: '#F5E6EC',
  shadow: 'rgba(255, 107, 157, 0.15)',

  gradientPink: ['#FF6B9D', '#FF9A3C'],
  gradientPurple: ['#C77DFF', '#FF6B9D'],
  gradientSoft: ['#FFF0F3', '#FFE4ED'],
} as const;

export const FONTS = {
  regular: 'System',
  bold: 'System',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
} as const;

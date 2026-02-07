import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  outline: `1px solid ${vars.color.border}`,
});

export const header = style({
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '480px',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bgSecondary,
  textAlign: 'center',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const headerActions = style({
  position: 'absolute',
  right: vars.space.lg,
  top: '50%',
  transform: 'translateY(-50%)',
});

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.gold,
  letterSpacing: '2px',
});

export const main = style({
  flex: 1,
  padding: vars.space.lg,
  paddingTop: '82px',
  paddingBottom: '200px',
  backgroundColor: vars.color.bgSecondary,
});

export const tabBar = style({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '480px',
  display: 'flex',
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bgSecondary,
  zIndex: 100,
});

export const tabItem = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  padding: `${vars.space.sm} 0`,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  transition: 'color 0.2s, background-color 0.2s',
  selectors: {
    '&:hover': {
      color: vars.color.textSecondary,
      backgroundColor: vars.color.bgHover,
    },
    '&[data-active="true"]': {
      color: vars.color.gold,
    },
    '&[data-active="true"]:hover': {
      color: vars.color.goldLight,
      backgroundColor: vars.color.bgHover,
    },
  },
});

export const tabIcon = style({
  fontSize: vars.fontSize.lg,
});

export const tabLabel = style({
  fontSize: vars.fontSize.xs,
});

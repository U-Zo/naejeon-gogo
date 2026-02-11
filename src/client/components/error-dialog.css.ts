import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 300,
  padding: vars.space.lg,
});

export const content = style({
  width: '100%',
  maxWidth: '320px',
  backgroundColor: vars.color.bgSecondary,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  padding: vars.space.xl,
  textAlign: 'center',
});

export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 700,
  color: vars.color.error,
});

export const message = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textSecondary,
  marginBottom: vars.space.xl,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
  whiteSpace: 'pre-line',
});

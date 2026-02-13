import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const canvasContainer = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '9 / 16',
  backgroundColor: vars.color.bgSecondary,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  border: `1px solid ${vars.color.border}`,
});

export const canvas = style({
  display: 'block',
  width: '100%',
  height: '100%',
});


export const timerOverlay = style({
  position: 'absolute',
  top: vars.space.sm,
  left: vars.space.sm,
  backgroundColor: 'rgba(10, 20, 40, 0.85)',
  borderRadius: vars.radius.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  fontFamily: vars.font.mono,
});

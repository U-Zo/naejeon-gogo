import { style } from '@vanilla-extract/css';

export const crackOverlay = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  pointerEvents: 'none',
  overflow: 'hidden',
});

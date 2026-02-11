import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const adminButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  padding: vars.space.xs,
  transition: 'color 0.2s',
  selectors: {
    '&:hover': {
      color: vars.color.gold,
    },
    '&[data-active="true"]': {
      color: vars.color.gold,
    },
  },
});

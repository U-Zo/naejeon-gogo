import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const card = style({
  width: '100%',
  textAlign: 'left',
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
});

export const cardClickable = style({
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s',
  selectors: {
    '&:hover': {
      borderColor: vars.color.goldDark,
      backgroundColor: vars.color.bgHover,
    },
    '&[data-selected="true"]': {
      borderColor: vars.color.gold,
      backgroundColor: vars.color.bgHover,
    },
  },
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.md,
});

export const headerTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.gold,
});

export const mmrDiffBadge = style({
  fontSize: vars.fontSize.xs,
  padding: `2px ${vars.space.sm}`,
  borderRadius: '999px',
  backgroundColor: vars.color.bgHover,
  color: vars.color.blueLight,
  fontFamily: vars.font.mono,
});

export const matchTeams = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.xs,
});

export const teamColumn = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

const teamLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const teamLabelA = style([teamLabel, { color: vars.color.teamA }]);
export const teamLabelB = style([teamLabel, { color: vars.color.teamB, justifyContent: 'flex-end' }]);

export const teamMmr = style({
  fontFamily: vars.font.mono,
  fontWeight: 400,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const teamMembers = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const memberSlot = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.md,
});

export const memberSlotRight = style([
  {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.xs,
    fontSize: vars.fontSize.md,
    flexDirection: 'row-reverse',
  },
]);

export const positionTag = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  flexShrink: 0,
  width: '46px',
  selectors: {
    [`${memberSlotRight} &`]: {
      textAlign: 'right',
    },
  },
});

export const memberName = style({
  color: vars.color.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const vsColumn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: vars.space.xl,
  flexShrink: 0,
});

export const vsLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.goldDark,
});

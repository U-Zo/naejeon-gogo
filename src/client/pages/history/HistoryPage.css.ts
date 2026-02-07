import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

const borderGlow = keyframes({
  '0%, 100%': { borderColor: vars.color.goldDark, boxShadow: `0 0 8px rgba(200, 170, 110, 0.15)` },
  '50%': { borderColor: vars.color.gold, boxShadow: `0 0 16px rgba(200, 170, 110, 0.3)` },
});


export const matchList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const matchCard = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
});

export const matchHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.md,
});

export const matchDate = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
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
});

export const teamLabelA = style([teamLabel, { color: vars.color.teamA }]);
export const teamLabelB = style([teamLabel, { color: vars.color.teamB, textAlign: 'right' }]);

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

const winnerBadge = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  padding: `2px ${vars.space.sm}`,
  borderRadius: '999px',
});

export const winnerBadgeA = style([
  winnerBadge,
  { backgroundColor: vars.color.teamA, color: '#fff' },
]);

export const winnerBadgeB = style([
  winnerBadge,
  { backgroundColor: vars.color.teamB, color: '#fff' },
]);

export const sectionTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.goldDark,
  margin: `${vars.space.md} 0 ${vars.space.sm}`,
});

export const completedSection = style({
  marginTop: vars.space.lg,
});

export const inProgressCard = style({
  backgroundColor: vars.color.bgCard,
  border: `1.5px solid ${vars.color.goldDark}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
  animation: `${borderGlow} 3s ease-in-out infinite`,
});

export const inProgressBadge = style([
  winnerBadge,
  { backgroundColor: vars.color.goldDark, color: '#fff' },
]);

export const inProgressActions = style({
  display: 'flex',
  gap: vars.space.sm,
  marginTop: vars.space.md,
});

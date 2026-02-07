import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const section = style({});

export const sectionTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.goldLight,
  marginBottom: vars.space.md,
});

export const memberGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.xs,
});

export const memberRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  cursor: 'pointer',
  transition: 'all 0.2s',
  selectors: {
    '&:hover': {
      borderColor: vars.color.goldDark,
      backgroundColor: vars.color.bgHover,
    },
    '&[data-selected="true"]': {
      borderColor: vars.color.gold,
      backgroundColor: vars.color.bgHover,
    },
    '&[data-selected="true"]:hover': {
      borderColor: vars.color.goldLight,
    },
  },
});

export const memberRowInfo = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const memberRowName = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const memberRowMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
});

export const selectionCount = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginBottom: vars.space.sm,
});

export const selectionCountHighlight = style({
  fontWeight: 700,
  color: vars.color.gold,
});

// --- Candidate cards (matches history card style) ---

export const candidateList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const candidateCard = style({
  width: '100%',
  textAlign: 'left',
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
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

export const candidateHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.md,
});

export const candidateIndex = style({
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

export const actionBar = style({
  display: 'flex',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
});

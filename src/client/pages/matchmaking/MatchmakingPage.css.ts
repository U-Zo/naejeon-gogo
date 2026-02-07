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

export const candidateCard = style({
  width: '100%',
  textAlign: 'left',
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
  marginBottom: vars.space.md,
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

export const teamSection = style({
  marginBottom: vars.space.sm,
});

const teamLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  marginBottom: vars.space.xs,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const teamLabelA = style([teamLabel, { color: vars.color.teamA }]);

export const teamLabelB = style([
  teamLabel,
  { color: vars.color.teamB, justifyContent: 'flex-end' },
]);

export const teamMmr = style({
  fontFamily: vars.font.mono,
  fontWeight: 400,
});

export const slotRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `2px 0`,
  fontSize: vars.fontSize.sm,
});

export const slotPosition = style({
  width: '50px',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

export const slotName = style({
  flex: 1,
  color: vars.color.textPrimary,
});

export const actionBar = style({
  display: 'flex',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
});

export const vsText = style({
  textAlign: 'center',
  fontSize: vars.fontSize.lg,
  fontWeight: 700,
  color: vars.color.goldDark,
  padding: `${vars.space.xs} 0`,
});


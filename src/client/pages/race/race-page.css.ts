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



export const actionBar = style({
  display: 'flex',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
});

export const finishList = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
  backgroundColor: 'rgba(10, 20, 40, 0.85)',
  borderRadius: vars.radius.md,
  padding: vars.space.sm,
  minWidth: '120px',
  maxHeight: '60%',
  overflowY: 'auto',
  border: `1px solid ${vars.color.border}`,
});

export const finishItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.xs,
  padding: '2px 0',
  color: vars.color.textPrimary,
});

export const finishOrder = style({
  fontWeight: 700,
  color: vars.color.gold,
  fontFamily: vars.font.mono,
  width: '24px',
  textAlign: 'right',
});

export const resultContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const resultTeams = style({
  display: 'flex',
  gap: vars.space.md,
});

export const resultTeamColumn = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const resultTeamLabel = style({
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  marginBottom: vars.space.xs,
});

export const resultTeamLabelA = style([resultTeamLabel, { color: vars.color.teamA }]);
export const resultTeamLabelB = style([resultTeamLabel, { color: vars.color.teamB }]);

export const resultMemberRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.bgCard,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
});

export const resultRank = style({
  fontWeight: 700,
  color: vars.color.gold,
  fontFamily: vars.font.mono,
  width: '24px',
  textAlign: 'right',
});

export const resultName = style({
  color: vars.color.textPrimary,
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

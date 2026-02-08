import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const memberList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const memberCard = style({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space.md,
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  selectors: {
    '&:hover': {
      borderColor: vars.color.goldDark,
    },
  },
});

export const memberInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
});

export const memberName = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.textPrimary,
});

export const memberMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
});

export const tempBadge = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.warning,
  border: `1px solid ${vars.color.warning}`,
  borderRadius: '999px',
  padding: `0 ${vars.space.sm}`,
  lineHeight: '1.6',
});

export const positionChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '4px',
});

export const positionGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

export const positionToggle = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bgInput,
  color: vars.color.textSecondary,
  transition: 'all 0.2s',
  cursor: 'pointer',
  selectors: {
    '&[data-selected="true"]': {
      backgroundColor: vars.color.goldDark,
      color: vars.color.goldLight,
      borderColor: vars.color.gold,
    },
  },
});

export const addButtonWrapper = style({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '480px',
  pointerEvents: 'none',
  zIndex: 50,
});

export const addButton = style({
  position: 'absolute',
  bottom: '88px',
  right: vars.space.lg,
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: vars.color.gold,
  color: vars.color.bgPrimary,
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: 1,
  paddingBottom: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
  pointerEvents: 'auto',
  transition: 'transform 0.2s',
  selectors: {
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});

export const statsRow = style({
  display: 'flex',
  gap: vars.space.md,
  marginBottom: vars.space.md,
});

export const statBox = style({
  flex: 1,
  textAlign: 'center',
  padding: vars.space.md,
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const statValue = style({
  fontSize: vars.fontSize.xl,
  fontWeight: 700,
  color: vars.color.goldLight,
  fontFamily: vars.font.mono,
});

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: '2px',
});

export const checkbox = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  cursor: 'pointer',
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
});

export const checkboxInput = style({
  width: '18px',
  height: '18px',
  accentColor: vars.color.gold,
});

export const deleteConfirmContent = style({
  padding: vars.space.xl,
  textAlign: 'center',
});

export const deleteConfirmText = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textPrimary,
  marginBottom: vars.space.xl,
});

export const deleteConfirmActions = style({
  display: 'flex',
  gap: vars.space.sm,
  justifyContent: 'center',
});

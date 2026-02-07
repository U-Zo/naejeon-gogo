import { style } from '@vanilla-extract/css';
import { vars } from '#/client/styles/theme.css';

export const pageTitle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: 700,
  color: vars.color.goldLight,
  marginBottom: vars.space.lg,
});

const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  transition: 'background-color 0.2s, opacity 0.2s',
  selectors: {
    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
});

export const buttonPrimary = style([
  button,
  {
    backgroundColor: vars.color.gold,
    color: vars.color.bgPrimary,
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: vars.color.goldLight,
      },
    },
  },
]);

export const buttonSecondary = style([
  button,
  {
    backgroundColor: vars.color.bgHover,
    color: vars.color.textPrimary,
    border: `1px solid ${vars.color.border}`,
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: vars.color.bgInput,
        borderColor: vars.color.goldDark,
      },
    },
  },
]);

export const buttonDanger = style([
  button,
  {
    backgroundColor: vars.color.error,
    color: '#fff',
    selectors: {
      '&:hover:not(:disabled)': {
        opacity: '0.9',
      },
    },
  },
]);

export const buttonTeamA = style([
  button,
  {
    backgroundColor: vars.color.teamA,
    color: '#fff',
    selectors: {
      '&:hover:not(:disabled)': {
        opacity: '0.9',
      },
    },
  },
]);

export const buttonTeamB = style([
  button,
  {
    backgroundColor: vars.color.teamB,
    color: '#fff',
    selectors: {
      '&:hover:not(:disabled)': {
        opacity: '0.9',
      },
    },
  },
]);

export const input = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.bgInput,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  color: vars.color.textPrimary,
  outline: 'none',
  transition: 'border-color 0.2s',
  selectors: {
    '&:focus': {
      borderColor: vars.color.goldDark,
    },
    '&::placeholder': {
      color: vars.color.textMuted,
    },
  },
});

export const label = style({
  display: 'block',
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginBottom: vars.space.xs,
});

export const fieldGroup = style({
  marginBottom: vars.space.md,
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `2px ${vars.space.sm}`,
  borderRadius: '999px',
  fontSize: vars.fontSize.xs,
  backgroundColor: vars.color.bgHover,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.border}`,
});

export const searchInput = style([
  input,
  {
    marginBottom: vars.space.md,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b5a56' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${vars.space.md} center`,
    paddingRight: '40px',
  },
]);

export const dialogHeader = style({
  position: 'relative',
  textAlign: 'center',
  marginBottom: vars.space.md,
});

export const closeButton = style({
  position: 'absolute',
  top: `calc(-1 * ${vars.space.md})`,
  right: `calc(-1 * ${vars.space.md})`,
  color: vars.color.textMuted,
  padding: vars.space.xs,
  borderRadius: vars.radius.sm,
  transition: 'color 0.2s',
  selectors: {
    '&:hover': {
      color: vars.color.textPrimary,
    },
  },
});

export const emptyState = style({
  textAlign: 'center',
  padding: `${vars.space['2xl']} ${vars.space.lg}`,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

export const errorText = style({
  color: vars.color.error,
  fontSize: vars.fontSize.sm,
  marginTop: vars.space.xs,
});

export const mmrText = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.blueLight,
});

export const streakBadgeWin = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 700,
  backgroundColor: 'rgba(227, 100, 20, 0.15)',
  color: '#f0923e',
  border: '1px solid rgba(227, 100, 20, 0.3)',
  whiteSpace: 'nowrap',
});

export const streakBadgeLose = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 700,
  backgroundColor: 'rgba(74, 144, 217, 0.15)',
  color: '#6aabea',
  border: '1px solid rgba(74, 144, 217, 0.3)',
  whiteSpace: 'nowrap',
});

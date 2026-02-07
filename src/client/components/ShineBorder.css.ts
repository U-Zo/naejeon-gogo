import { keyframes, style } from '@vanilla-extract/css';

const shine = keyframes({
  '0%': { backgroundPosition: '0% 0%' },
  '50%': { backgroundPosition: '100% 100%' },
  '100%': { backgroundPosition: '0% 0%' },
});

export const shineBorder = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  pointerEvents: 'none',
  backgroundSize: '300% 300%',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
  willChange: 'background-position',
  animationName: shine,
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
});

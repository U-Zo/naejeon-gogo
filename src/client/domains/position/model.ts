export type Position = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

export type TeamSide = 'A' | 'B';

export const POSITIONS: Position[] = ['top', 'jungle', 'mid', 'adc', 'support'];

export const POSITION_LABELS: Record<Position, string> = {
  top: '탑',
  jungle: '정글',
  mid: '미드',
  adc: '원딜',
  support: '서폿',
};

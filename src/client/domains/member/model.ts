import type { Position } from '#/client/domains/position/model';

export type Streak = { count: number; type: 'win' | 'lose' };

export type Member = {
  id: string;
  name: string;
  mainPosition: Position;
  subPositions: Position[];
  mmr: number;
  isTemporary: boolean;
  createdAt: string;
  streak: Streak | null;
};

export type MemberInput = {
  name: string;
  mainPosition: Position;
  subPositions: Position[];
  isTemporary: boolean;
  mmr?: number;
};

import type Matter from 'matter-js';

export type Racer = {
  id: string;
  name: string;
  body: Matter.Body;
  finishOrder: number | null;
  finishTime: number | null;
  forceAngle: number;
  stuckTime: number;
};

export type RaceConfig = {
  trackLength: number;
  trackWidth: number;
  laneCount: number;
  forceMin: number;
  forceMax: number;
  forceInterval: number;
  frictionAir: number;
  boostForce: number;
  maxDuration: number;
  minFirstFinish: number;
};

export type RaceResult = {
  memberId: string;
  name: string;
  finishOrder: number;
};

export type Obstacle = {
  body: Matter.Body;
  type: 'bumper' | 'wall' | 'spinner';
};

export const DEFAULT_RACE_CONFIG: RaceConfig = {
  trackLength: 6000,
  trackWidth: 500,
  laneCount: 10,
  forceMin: 0.0003,
  forceMax: 0.002,
  forceInterval: 1000,
  frictionAir: 0.001,
  boostForce: 0.015,
  maxDuration: 45_000,
  minFirstFinish: 15_000,
};

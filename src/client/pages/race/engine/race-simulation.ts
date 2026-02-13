import Matter from 'matter-js';
import { DEFAULT_RACE_CONFIG, type Obstacle, type RaceConfig, type RaceResult, type Racer } from './types';

export class RaceSimulation {
  private engine: Matter.Engine;
  private racers: Racer[] = [];
  private obstacles: Obstacle[] = [];
  private config: RaceConfig;
  private elapsedTime = 0;
  private lastForceTime = 0;
  private finishCount = 0;
  private _isComplete = false;

  constructor(
    members: { id: string; name: string }[],
    config: Partial<RaceConfig> = {},
  ) {
    this.config = { ...DEFAULT_RACE_CONFIG, ...config };
    this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0.3 } });
    this.setupTrack();
    this.setupRacers(members);
    this.generateObstacles();
  }

  private setupTrack() {
    const { trackLength, trackWidth } = this.config;
    const wallThickness = 40;

    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2, trackLength / 2,
      wallThickness, trackLength + 200,
      { isStatic: true, restitution: 0.5 },
    );
    const rightWall = Matter.Bodies.rectangle(
      trackWidth + wallThickness / 2, trackLength / 2,
      wallThickness, trackLength + 200,
      { isStatic: true, restitution: 0.5 },
    );
    const topWall = Matter.Bodies.rectangle(
      trackWidth / 2, -wallThickness / 2,
      trackWidth + 200, wallThickness,
      { isStatic: true, restitution: 0.3 },
    );

    Matter.Composite.add(this.engine.world, [leftWall, rightWall, topWall]);
  }

  private setupRacers(members: { id: string; name: string }[]) {
    const { trackWidth, laneCount, frictionAir } = this.config;
    const laneWidth = trackWidth / laneCount;
    const racerRadius = Math.min(laneWidth * 0.35, 20);

    // Pack racers tightly near center so they collide immediately
    const clusterWidth = trackWidth * 0.3;
    const clusterStartX = (trackWidth - clusterWidth) / 2;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const x = clusterStartX + Math.random() * clusterWidth;
      const body = Matter.Bodies.circle(x, 30 + Math.random() * 20, racerRadius, {
        frictionAir,
        restitution: 0.3,
        friction: 0.01,
        density: 0.001,
        label: member.id,
      });

      Matter.Composite.add(this.engine.world, body);

      // Shotgun blast: setVelocity for instant scatter, ±60° wide angle
      const angle = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 2 / 3);
      const speed = 8 + Math.random() * 12;
      Matter.Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      });

      this.racers.push({
        id: member.id,
        name: member.name,
        body,
        finishOrder: null,
        finishTime: null,
        forceAngle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
      });
    }
  }

  private generateObstacles() {
    const { trackLength, trackWidth } = this.config;
    const margin = 40;
    const safeZoneTop = 150;
    const safeZoneBottom = trackLength - 100;
    const types: Obstacle['type'][] = ['bumper', 'wall', 'spinner'];
    const minSpacing = 55;
    const placed: { x: number; y: number }[] = [];

    // 3 zones: sparse top, medium middle, dense bottom (reversal zone)
    const zones = [
      { from: safeZoneTop, to: trackLength * 0.4, count: 6 },
      { from: trackLength * 0.4, to: trackLength * 0.7, count: 10 },
      { from: trackLength * 0.7, to: safeZoneBottom, count: 18 },
    ];

    for (const zone of zones) {
      for (let i = 0; i < zone.count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];

        let x = 0;
        let y = 0;
        let valid = false;
        for (let attempt = 0; attempt < 20; attempt++) {
          x = margin + Math.random() * (trackWidth - margin * 2);
          y = zone.from + Math.random() * (zone.to - zone.from);
          valid = placed.every((p) => Math.hypot(p.x - x, p.y - y) >= minSpacing);
          if (valid) break;
        }
        if (!valid) continue;

        placed.push({ x, y });

        let body: Matter.Body;
        // Bottom zone obstacles are bigger and bouncier for more chaos
        const inBottomZone = zone.from >= trackLength * 0.7;

        switch (type) {
          case 'bumper': {
            const radius = inBottomZone ? 12 + Math.random() * 14 : 8 + Math.random() * 12;
            body = Matter.Bodies.circle(x, y, radius, {
              isStatic: true,
              restitution: inBottomZone ? 0.6 : 0.3,
              label: 'bumper',
            });
            break;
          }
          case 'wall': {
            const w = inBottomZone ? 50 + Math.random() * 50 : 30 + Math.random() * 40;
            const h = 8 + Math.random() * 6;
            const angle = (Math.random() - 0.5) * Math.PI / 3;
            body = Matter.Bodies.rectangle(x, y, w, h, {
              isStatic: true,
              restitution: inBottomZone ? 0.5 : 0.2,
              angle,
              label: 'wall',
            });
            break;
          }
          case 'spinner':
          default: {
            const size = inBottomZone ? 14 + Math.random() * 12 : 10 + Math.random() * 10;
            body = Matter.Bodies.polygon(x, y, 3, size, {
              isStatic: true,
              restitution: inBottomZone ? 0.6 : 0.3,
              angle: Math.random() * Math.PI * 2,
              label: 'spinner',
            });
            break;
          }
        }

        Matter.Composite.add(this.engine.world, body);
        this.obstacles.push({ body, type });
      }
    }
  }

  getObstacles(): readonly Obstacle[] {
    return this.obstacles;
  }

  update(delta: number): void {
    if (this._isComplete) return;

    this.elapsedTime += delta;
    Matter.Engine.update(this.engine, delta);

    this.unstuckRacers();

    if (this.elapsedTime - this.lastForceTime >= this.config.forceInterval) {
      this.applyRandomForces();
      this.lastForceTime = this.elapsedTime;
    }

    this.checkFinishLine();

    if (this.elapsedTime > this.config.maxDuration) {
      this.applyBoostToRemaining();
    }

    if (this.finishCount >= this.racers.length) {
      this._isComplete = true;
    }
  }

  private applyRandomForces() {
    const { forceMin, forceMax } = this.config;
    const angleDriftMax = 0.15;

    for (const racer of this.racers) {
      if (racer.finishOrder !== null) continue;

      racer.forceAngle += (Math.random() - 0.5) * angleDriftMax;
      racer.forceAngle += (Math.PI / 2 - racer.forceAngle) * 0.05;

      const magnitude = forceMin + Math.random() * (forceMax - forceMin);
      Matter.Body.applyForce(racer.body, racer.body.position, {
        x: Math.cos(racer.forceAngle) * magnitude,
        y: Math.sin(racer.forceAngle) * magnitude,
      });
    }
  }

  private unstuckRacers() {
    for (const racer of this.racers) {
      if (racer.finishOrder !== null) continue;

      const speed = Matter.Vector.magnitude(racer.body.velocity);

      if (speed < 0.5) {
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
        Matter.Body.setVelocity(racer.body, {
          x: Math.cos(angle) * 12,
          y: Math.sin(angle) * 12,
        });
      }
    }
  }

  private checkFinishLine() {
    for (const racer of this.racers) {
      if (racer.finishOrder !== null) continue;

      if (racer.body.position.y >= this.config.trackLength) {
        this.finishCount++;
        racer.finishOrder = this.finishCount;
        racer.finishTime = this.elapsedTime;
        Matter.Composite.remove(this.engine.world, racer.body);
      }
    }
  }

  private applyBoostToRemaining() {
    for (const racer of this.racers) {
      if (racer.finishOrder !== null) continue;
      Matter.Body.applyForce(racer.body, racer.body.position, {
        x: 0,
        y: this.config.boostForce,
      });
    }
  }

  get isComplete(): boolean {
    return this._isComplete;
  }

  get elapsed(): number {
    return this.elapsedTime;
  }

  getRacers(): readonly Racer[] {
    return this.racers;
  }

  getActiveRacers(): Racer[] {
    return this.racers.filter((r) => r.finishOrder === null);
  }

  getFinishedRacers(): Racer[] {
    return this.racers
      .filter((r): r is Racer & { finishOrder: number } => r.finishOrder !== null)
      .sort((a, b) => a.finishOrder - b.finishOrder);
  }

  getResults(): RaceResult[] {
    return this.racers
      .filter((r): r is Racer & { finishOrder: number } => r.finishOrder !== null)
      .sort((a, b) => a.finishOrder - b.finishOrder)
      .map((r) => ({
        memberId: r.id,
        name: r.name,
        finishOrder: r.finishOrder,
      }));
  }

  getTrackLength(): number {
    return this.config.trackLength;
  }

  getTrackWidth(): number {
    return this.config.trackWidth;
  }

  destroy(): void {
    Matter.Engine.clear(this.engine);
  }
}

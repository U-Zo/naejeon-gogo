import * as styles from './crack-overlay.css';

type CrackPath = {
  d: string;
  strokeWidth: number;
  opacity: number;
};

// 시드 기반 의사 난수 생성기 (mulberry32)
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getEdgePoint(angleRad: number): { x: number; y: number } {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  let t = Infinity;

  if (cos > 0) t = Math.min(t, 50 / cos);
  if (cos < 0) t = Math.min(t, -50 / cos);
  if (sin > 0) t = Math.min(t, 50 / sin);
  if (sin < 0) t = Math.min(t, -50 / sin);

  return { x: 50 + t * cos, y: 50 + t * sin };
}

function generateLightningPoints(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  lengthFrac: number,
  segLen: number,
  jitter: number,
  rng: () => number,
): { x: number; y: number }[] {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const totalDist = Math.sqrt(dx * dx + dy * dy);
  const maxTravel = totalDist * lengthFrac;

  const dirX = dx / totalDist;
  const dirY = dy / totalDist;
  const perpX = -dirY;
  const perpY = dirX;

  const pts: { x: number; y: number }[] = [{ x: startX, y: startY }];
  let traveled = 0;
  let x = startX;
  let y = startY;

  while (traveled < maxTravel) {
    const step = segLen * (0.4 + rng() * 1.2);
    const lateral = (rng() - 0.5) * 2 * jitter;
    x += dirX * step + perpX * lateral;
    y += dirY * step + perpY * lateral;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    traveled += step;
    pts.push({ x, y });
  }

  return pts;
}

function pointsToSvgPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }
  return d;
}

const LEVEL_CONFIG = {
  // 2연패: 테두리에서 짧은 금
  1: {
    seed: 1001,
    mainCount: 5,
    lengthRange: [0.15, 0.3] as const,
    thicknessRange: [0.6, 1.0] as const,
    opacityRange: [0.15, 0.3] as const,
    segLen: 3,
    jitter: 2.5,
    branchChance: 0.1,
  },
  // 3연패: 중간까지 침투
  2: {
    seed: 2002,
    mainCount: 8,

    lengthRange: [0.3, 0.55] as const,
    thicknessRange: [0.9, 1.6] as const,
    opacityRange: [0.22, 0.42] as const,
    segLen: 3.5,
    jitter: 3,
    branchChance: 0.2,
  },
  // 4연패+: 가운데까지 완전 관통
  3: {
    seed: 3003,
    mainCount: 11,
    lengthRange: [0.7, 1.0] as const,
    thicknessRange: [1.2, 2.4] as const,
    opacityRange: [0.32, 0.55] as const,
    segLen: 3.5,
    jitter: 3.5,
    branchChance: 0.35,
  },
};

function generateCracks(level: 1 | 2 | 3): CrackPath[] {
  const cfg = LEVEL_CONFIG[level];
  const rng = createRng(cfg.seed);
  const result: CrackPath[] = [];

  for (let i = 0; i < cfg.mainCount; i++) {
    const baseAngle = (Math.PI * 2 * i) / cfg.mainCount;
    const angle = baseAngle + (rng() - 0.5) * ((Math.PI * 2) / cfg.mainCount) * 0.7;
    const edge = getEdgePoint(angle);

    const lengthFrac = cfg.lengthRange[0] + rng() * (cfg.lengthRange[1] - cfg.lengthRange[0]);
    const thickness =
      cfg.thicknessRange[0] + rng() * (cfg.thicknessRange[1] - cfg.thicknessRange[0]);
    const opacity = cfg.opacityRange[0] + rng() * (cfg.opacityRange[1] - cfg.opacityRange[0]);

    const pts = generateLightningPoints(
      edge.x,
      edge.y,
      50,
      50,
      lengthFrac,
      cfg.segLen,
      cfg.jitter,
      rng,
    );

    result.push({ d: pointsToSvgPath(pts), strokeWidth: thickness, opacity });

    // 가지(branch)
    for (let p = 2; p < pts.length - 1; p++) {
      if (rng() < cfg.branchChance) {
        const branchDir =
          Math.atan2(pts[p].y - pts[p - 1].y, pts[p].x - pts[p - 1].x) +
          (rng() > 0.5 ? 1 : -1) * (Math.PI / 5 + rng() * (Math.PI / 3));

        const branchTarget = {
          x: pts[p].x + Math.cos(branchDir) * 30,
          y: pts[p].y + Math.sin(branchDir) * 30,
        };

        const branchPts = generateLightningPoints(
          pts[p].x,
          pts[p].y,
          branchTarget.x,
          branchTarget.y,
          0.3 + rng() * 0.4,
          cfg.segLen * 0.7,
          cfg.jitter * 0.6,
          rng,
        );

        result.push({
          d: pointsToSvgPath(branchPts),
          strokeWidth: thickness * (0.25 + rng() * 0.3),
          opacity: opacity * (0.4 + rng() * 0.3),
        });
      }
    }
  }

  return result;
}

// 레벨별로 한 번만 생성하고 캐싱
const CACHED_PATHS: Record<number, CrackPath[]> = {};
function getCachedCracks(level: 1 | 2 | 3): CrackPath[] {
  if (!CACHED_PATHS[level]) {
    CACHED_PATHS[level] = generateCracks(level);
  }
  return CACHED_PATHS[level];
}

// --- 공개 API ---

const BORDER_COLORS: Record<number, string | undefined> = {
  1: undefined,
  2: undefined,
  3: undefined,
};

export function getLoseStreakLevel(count: number): number | null {
  if (count < 2) return null;
  if (count === 2) return 1;
  if (count === 3) return 2;
  return 3; // 4연패 이상
}

export function getCrackBorderColor(level: number): string | undefined {
  return BORDER_COLORS[level];
}

export function CrackOverlay({ level }: { level: 1 | 2 | 3 }) {
  const paths = getCachedCracks(level);

  return (
    <div className={styles.crackOverlay}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%' }}
      >
        {paths.map((crack, i) => (
          <path
            key={i}
            d={crack.d}
            fill="none"
            stroke={`rgba(0,0,0,${crack.opacity})`}
            strokeWidth={crack.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

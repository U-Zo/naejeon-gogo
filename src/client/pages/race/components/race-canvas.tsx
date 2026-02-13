import { useCallback, useEffect, useRef, useState } from 'react';
import * as styles from '../race-page.css';
import { Camera } from '../engine/camera';
import { RaceSimulation } from '../engine/race-simulation';
import { Renderer } from '../engine/renderer';
import type { RaceResult } from '../engine/types';

type RaceCanvasProps = {
  members: { id: string; name: string }[];
  onComplete: (results: RaceResult[]) => void;
};

export function RaceCanvas({ members, onComplete }: RaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<RaceSimulation | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [finishedRacers, setFinishedRacers] = useState<{ name: string; order: number }[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer(canvas);
    renderer.resize();
    rendererRef.current = renderer;

    const containerWidth = Math.min(canvas.getBoundingClientRect().width, 800);
    const sim = new RaceSimulation(members, { trackWidth: containerWidth });
    simRef.current = sim;

    const camera = new Camera();
    camera.resetToFullTrack(sim.getTrackLength(), sim.getTrackWidth(), renderer.height);
    cameraRef.current = camera;

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = Math.min(now - lastTimeRef.current, 50);
      lastTimeRef.current = now;

      sim.update(delta);

      const active = sim.getActiveRacers();
      camera.update(
        active.length > 0 ? active : [...sim.getRacers()],
        sim.getTrackLength(),
        sim.getTrackWidth(),
        renderer.width,
        renderer.height,
      );

      renderer.render(camera, sim.getRacers(), sim.getObstacles(), sim.getTrackLength(), sim.getTrackWidth());

      const finished = sim.getFinishedRacers();
      setFinishedRacers(finished.map((r) => ({ name: r.name, order: r.finishOrder ?? 0 })));
      setElapsedSeconds(Math.floor(sim.elapsed / 1000));

      if (sim.isComplete) {
        onCompleteRef.current(sim.getResults());
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [members]);

  useEffect(() => {
    startSimulation();

    const handleResize = () => {
      rendererRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      simRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [startSimulation]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className={styles.canvasContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.timerOverlay}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {finishedRacers.length > 0 && (
        <div className={styles.finishList}>
          {finishedRacers.map((r) => (
            <div key={r.order} className={styles.finishItem}>
              <span className={styles.finishOrder}>{r.order}</span>
              <span>{r.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

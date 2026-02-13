import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import * as styles from '../race-canvas.css';
import { Camera } from '../engine/camera';
import { RaceSimulation } from '../engine/race-simulation';
import { Renderer } from '../engine/renderer';
import type { RaceResult } from '../engine/types';

export type RaceCanvasHandle = {
  forceFinish: () => void;
};

type RaceCanvasProps = {
  members: { id: string; name: string }[];
  onComplete: (results: RaceResult[]) => void;
};

export const RaceCanvas = forwardRef<RaceCanvasHandle, RaceCanvasProps>(function RaceCanvas({ members, onComplete }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<RaceSimulation | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const forceFinishRef = useRef(false);

  useImperativeHandle(ref, () => ({
    forceFinish: () => { forceFinishRef.current = true; },
  }));

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

      renderer.render(camera, sim.getRacers(), sim.getObstacles(), sim.getTrackLength(), sim.getTrackWidth(), sim.getRankings());

      setElapsedSeconds(Math.floor(sim.elapsed / 1000));

      if (sim.isComplete) {
        onCompleteRef.current(sim.getResults());
        return;
      }

      if (forceFinishRef.current) {
        forceFinishRef.current = false;
        sim.forceFinish();
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


    </div>
  );
});

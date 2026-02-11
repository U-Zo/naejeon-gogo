import * as styles from './shine-border.css';

interface ShineBorderProps {
  borderWidth?: number;
  duration?: number;
  delay?: number;
  shineColor?: string | string[];
  className?: string;
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  delay = 0,
  shineColor = '#000000',
  className,
}: ShineBorderProps) {
  const colorStr = Array.isArray(shineColor) ? shineColor.join(',') : shineColor;

  return (
    <div
      className={className ? `${styles.shineBorder} ${className}` : styles.shineBorder}
      style={{
        padding: `${borderWidth}px`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`,
        backgroundImage: `radial-gradient(transparent, transparent, ${colorStr}, transparent, transparent)`,
      }}
    />
  );
}

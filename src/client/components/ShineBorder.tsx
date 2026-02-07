import * as styles from './ShineBorder.css';

interface ShineBorderProps {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
  className?: string;
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
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
        backgroundImage: `radial-gradient(transparent, transparent, ${colorStr}, transparent, transparent)`,
      }}
    />
  );
}

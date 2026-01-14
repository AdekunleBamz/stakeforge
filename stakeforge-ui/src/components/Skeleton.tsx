import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'wave',
  className = ''
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    `skeleton--${animation}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} style={style} aria-hidden="true" />;
}

export function SkeletonText({ 
  lines = 3, 
  lastLineWidth = '60%',
  className = '' 
}: SkeletonTextProps) {
  return (
    <div className={`skeleton-text ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton-card ${className}`} aria-hidden="true">
      <Skeleton variant="rectangular" height={160} />
      <div className="skeleton-card__content">
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="text" width="40%" height={16} />
        <div className="skeleton-card__footer">
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAvatar({ 
  size = 40,
  className = '' 
}: { 
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size} 
      className={className}
    />
  );
}

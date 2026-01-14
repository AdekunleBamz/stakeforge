import React from 'react';
import './Grid.css';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}) => {
  const classes = [
    'grid',
    `grid-cols-${cols}`,
    `grid-gap-${gap}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  span,
  className = '',
}) => {
  const classes = [
    'grid-item',
    span ? `grid-span-${span}` : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

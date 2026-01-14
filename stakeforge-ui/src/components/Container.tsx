import React from 'react';
import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  padding = true,
}) => {
  const classes = [
    'container',
    `container-${size}`,
    padding ? 'container-padded' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

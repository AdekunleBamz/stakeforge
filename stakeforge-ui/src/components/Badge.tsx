import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  pulse = false,
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${pulse ? 'badge-pulse' : ''}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};

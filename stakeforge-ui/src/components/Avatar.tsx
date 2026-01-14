import React, { useState } from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showBorder?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    '#5865F2', // primary
    '#3BA55C', // green
    '#FAA61A', // yellow
    '#F47B67', // coral
    '#9B59B6', // purple
    '#3498DB', // blue
    '#E74C3C', // red
    '#1ABC9C', // teal
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  status,
  showBorder = false,
  className = ''
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  
  const classes = [
    'avatar',
    `avatar--${size}`,
    `avatar--${variant}`,
    showBorder && 'avatar--bordered',
    className
  ].filter(Boolean).join(' ');

  const showImage = src && !imgError;
  const showInitials = !showImage && name;
  const showFallback = !showImage && !name;

  return (
    <div className={classes}>
      {showImage && (
        <img 
          src={src} 
          alt={alt || name || 'Avatar'} 
          className="avatar__image"
          onError={() => setImgError(true)}
        />
      )}
      
      {showInitials && (
        <span 
          className="avatar__initials"
          style={{ backgroundColor: getColorFromName(name) }}
        >
          {getInitials(name)}
        </span>
      )}
      
      {showFallback && (
        <span className="avatar__fallback">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </span>
      )}
      
      {status && (
        <span className={`avatar__status avatar__status--${status}`} />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className = ''
}: AvatarGroupProps) {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={`avatar-group avatar-group--${size} ${className}`}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className={`avatar avatar--${size} avatar--circle avatar-group__overflow`}>
          <span className="avatar__initials">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}

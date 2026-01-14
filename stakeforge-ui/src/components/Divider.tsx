import { ReactNode } from 'react';
import './Divider.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  label?: ReactNode;
  labelPosition?: 'left' | 'center' | 'right';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  labelPosition = 'center',
  spacing = 'medium',
  className = ''
}: DividerProps) {
  const classes = [
    'divider',
    `divider--${orientation}`,
    `divider--${variant}`,
    `divider--spacing-${spacing}`,
    label && `divider--with-label divider--label-${labelPosition}`,
    className
  ].filter(Boolean).join(' ');

  if (orientation === 'vertical') {
    return <div className={classes} role="separator" aria-orientation="vertical" />;
  }

  if (label) {
    return (
      <div className={classes} role="separator">
        <span className="divider__line" />
        <span className="divider__label">{label}</span>
        <span className="divider__line" />
      </div>
    );
  }

  return <hr className={classes} />;
}

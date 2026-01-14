import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'medium',
  hover = false,
  glow = false,
  className = '',
  onClick
}: CardProps) {
  const classes = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hover && 'card--hover',
    glow && 'card--glow',
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`card__header ${className}`}>
      <div className="card__header-content">{children}</div>
      {action && <div className="card__header-action">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`card__body ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, align = 'right', className = '' }: CardFooterProps) {
  return (
    <div className={`card__footer card__footer--${align} ${className}`}>
      {children}
    </div>
  );
}

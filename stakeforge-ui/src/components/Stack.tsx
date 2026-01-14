import React from 'react';
import './Stack.css';

interface StackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
}) => {
  const classes = [
    'stack',
    `stack-${direction}`,
    `stack-gap-${gap}`,
    `stack-align-${align}`,
    `stack-justify-${justify}`,
    wrap ? 'stack-wrap' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import './Input.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  size = 'medium',
  variant = 'default',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  
  const wrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-wrapper--full-width',
    className
  ].filter(Boolean).join(' ');

  const fieldClasses = [
    'input-field',
    `input-field--${size}`,
    `input-field--${variant}`,
    leftIcon && 'input-field--has-left-icon',
    rightIcon && 'input-field--has-right-icon',
    error && 'input-field--error',
    disabled && 'input-field--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <div className={fieldClasses}>
        {leftIcon && (
          <span className="input-icon input-icon--left">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className="input-element"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <span className="input-icon input-icon--right">
            {rightIcon}
          </span>
        )}
      </div>
      
      {error && (
        <span id={`${inputId}-error`} className="input-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </span>
      )}
      
      {hint && !error && (
        <span id={`${inputId}-hint`} className="input-hint">
          {hint}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

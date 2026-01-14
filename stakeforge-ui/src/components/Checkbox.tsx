import { InputHTMLAttributes, forwardRef } from 'react';
import './Checkbox.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  size = 'medium',
  indeterminate = false,
  error,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
  
  const wrapperClasses = [
    'checkbox-wrapper',
    disabled && 'checkbox-wrapper--disabled',
    error && 'checkbox-wrapper--error',
    className
  ].filter(Boolean).join(' ');

  const checkboxClasses = [
    'checkbox',
    `checkbox--${size}`,
    indeterminate && 'checkbox--indeterminate'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className="checkbox__container">
        <div className={checkboxClasses}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="checkbox__input"
            disabled={disabled}
            aria-invalid={!!error}
            {...props}
          />
          <span className="checkbox__box">
            <svg className="checkbox__check" viewBox="0 0 12 12" fill="none">
              <path 
                d="M2 6L5 9L10 3" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <svg className="checkbox__indeterminate" viewBox="0 0 12 12" fill="none">
              <path 
                d="M2 6H10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        
        {(label || description) && (
          <div className="checkbox__label-wrapper">
            {label && (
              <label htmlFor={checkboxId} className="checkbox__label">
                {label}
              </label>
            )}
            {description && (
              <span className="checkbox__description">{description}</span>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <span className="checkbox__error" role="alert">{error}</span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

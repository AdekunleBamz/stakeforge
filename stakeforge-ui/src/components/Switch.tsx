import { InputHTMLAttributes, forwardRef } from 'react';
import './Switch.css';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success';
  labelPosition?: 'left' | 'right';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  description,
  size = 'medium',
  variant = 'default',
  labelPosition = 'right',
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).slice(2, 9)}`;
  
  const wrapperClasses = [
    'switch-wrapper',
    `switch-wrapper--label-${labelPosition}`,
    disabled && 'switch-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  const switchClasses = [
    'switch',
    `switch--${size}`,
    `switch--${variant}`
  ].filter(Boolean).join(' ');

  const content = (label || description) && (
    <div className="switch__label-wrapper">
      {label && (
        <label htmlFor={switchId} className="switch__label">
          {label}
        </label>
      )}
      {description && (
        <span className="switch__description">{description}</span>
      )}
    </div>
  );

  return (
    <div className={wrapperClasses}>
      {labelPosition === 'left' && content}
      
      <div className={switchClasses}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          className="switch__input"
          disabled={disabled}
          {...props}
        />
        <span className="switch__track">
          <span className="switch__thumb" />
        </span>
      </div>
      
      {labelPosition === 'right' && content}
    </div>
  );
});

Switch.displayName = 'Switch';

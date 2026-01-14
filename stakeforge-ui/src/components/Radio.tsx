import { InputHTMLAttributes, forwardRef, createContext, useContext, ReactNode } from 'react';
import './Radio.css';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size: 'small' | 'medium' | 'large';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  children: ReactNode;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  children,
  name,
  value,
  onChange,
  disabled = false,
  size = 'medium',
  orientation = 'vertical',
  className = ''
}: RadioGroupProps) {
  const classes = [
    'radio-group',
    `radio-group--${orientation}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled, size }}>
      <div className={classes} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  size: sizeProp,
  className = '',
  id,
  disabled: disabledProp,
  value,
  name: nameProp,
  checked: checkedProp,
  onChange: onChangeProp,
  ...props
}, ref) => {
  const context = useContext(RadioGroupContext);
  
  const name = context?.name || nameProp;
  const size = sizeProp || context?.size || 'medium';
  const disabled = disabledProp || context?.disabled;
  const checked = context ? context.value === value : checkedProp;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (context?.onChange && value) {
      context.onChange(value as string);
    }
    onChangeProp?.(e);
  };
  
  const radioId = id || `radio-${Math.random().toString(36).slice(2, 9)}`;
  
  const wrapperClasses = [
    'radio-wrapper',
    disabled && 'radio-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  const radioClasses = [
    'radio',
    `radio--${size}`
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className="radio__container">
        <div className={radioClasses}>
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            className="radio__input"
            disabled={disabled}
            {...props}
          />
          <span className="radio__circle">
            <span className="radio__dot" />
          </span>
        </div>
        
        {(label || description) && (
          <div className="radio__label-wrapper">
            {label && (
              <label htmlFor={radioId} className="radio__label">
                {label}
              </label>
            )}
            {description && (
              <span className="radio__description">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Radio.displayName = 'Radio';

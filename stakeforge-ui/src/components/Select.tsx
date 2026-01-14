import { useState, useRef, useEffect, ReactNode } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  searchable?: boolean;
  className?: string;
}

export function Select({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  hint,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  searchable = false,
  className = ''
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = searchable && search
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    } else if (e.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    }
  };

  const wrapperClasses = [
    'select-wrapper',
    fullWidth && 'select-wrapper--full-width',
    className
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    'select__trigger',
    `select__trigger--${size}`,
    isOpen && 'select__trigger--open',
    error && 'select__trigger--error',
    disabled && 'select__trigger--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} ref={containerRef}>
      {label && <label className="select__label">{label}</label>}
      
      <div className="select" onKeyDown={handleKeyDown}>
        <button
          type="button"
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`select__value ${!selectedOption ? 'select__placeholder' : ''}`}>
            {selectedOption?.icon}
            {selectedOption?.label || placeholder}
          </span>
          <svg className="select__arrow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        
        {isOpen && (
          <div className="select__dropdown" role="listbox">
            {searchable && (
              <div className="select__search">
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="select__search-input"
                />
              </div>
            )}
            <div className="select__options">
              {filteredOptions.length === 0 ? (
                <div className="select__empty">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select__option ${option.value === value ? 'select__option--selected' : ''} ${option.disabled ? 'select__option--disabled' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.icon && <span className="select__option-icon">{option.icon}</span>}
                    {option.label}
                    {option.value === value && (
                      <svg className="select__check" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && <span className="select__error">{error}</span>}
      {hint && !error && <span className="select__hint">{hint}</span>}
    </div>
  );
}

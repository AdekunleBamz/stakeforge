import React, { useState } from 'react';
import './QuantitySelector.css';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
}) => {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`quantity-selector ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="qty-btn"
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      
      <input
        type="number"
        className="qty-input"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        className="qty-btn"
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

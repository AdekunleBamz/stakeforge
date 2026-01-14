import React, { useState, useEffect } from 'react';
import './Toast.css';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" opacity="0.2"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" opacity="0.2"/>
      <path d="M12.5 7.5l-5 5M7.5 7.5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" opacity="0.2"/>
      <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" opacity="0.2"/>
      <path d="M10 14v-4M10 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`toast toast-${type} ${isVisible ? 'visible' : 'hidden'}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button 
        className="toast-close" 
        onClick={() => onClose()}
        aria-label="Dismiss notification"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div 
        className="toast-progress" 
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

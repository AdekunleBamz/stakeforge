import React from 'react';
import './CountdownTimer.css';
import { useCountdown } from '../hooks';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  label = 'Time remaining',
}) => {
  const { days, hours, minutes, seconds, isComplete } = useCountdown(targetDate);

  React.useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  if (isComplete) {
    return (
      <div className="countdown-timer complete">
        <span className="countdown-label">Completed!</span>
      </div>
    );
  }

  return (
    <div className="countdown-timer">
      <span className="countdown-label">{label}</span>
      <div className="countdown-units">
        <div className="time-unit">
          <span className="time-value">{String(days).padStart(2, '0')}</span>
          <span className="time-label">Days</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="time-value">{String(hours).padStart(2, '0')}</span>
          <span className="time-label">Hours</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="time-value">{String(minutes).padStart(2, '0')}</span>
          <span className="time-label">Mins</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="time-value">{String(seconds).padStart(2, '0')}</span>
          <span className="time-label">Secs</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import './StatNumber.css';

interface StatNumberProps {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'small' | 'medium' | 'large';
}

export const StatNumber: React.FC<StatNumberProps> = ({
  value,
  label,
  prefix,
  suffix,
  trend,
  trendValue,
  size = 'medium',
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className={`stat-number stat-${size}`}>
      <div className="stat-value-container">
        {prefix && <span className="stat-prefix">{prefix}</span>}
        <span className="stat-value">{value}</span>
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      
      <div className="stat-label-row">
        <span className="stat-label">{label}</span>
        {trend && (
          <span className={`stat-trend trend-${trend}`}>
            {getTrendIcon()} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

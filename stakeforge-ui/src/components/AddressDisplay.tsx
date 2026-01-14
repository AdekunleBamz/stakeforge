import React, { useState, useEffect } from 'react';
import './AddressDisplay.css';
import { useCopyToClipboard } from '../hooks';

interface AddressDisplayProps {
  address: string;
  label?: string;
  showFullOnHover?: boolean;
  explorerUrl?: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  label,
  showFullOnHover = true,
  explorerUrl = 'https://basescan.org/address/',
}) => {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const [showFull, setShowFull] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    copyToClipboard(address);
  };

  return (
    <div 
      className="address-display"
      onMouseEnter={() => showFullOnHover && setShowFull(true)}
      onMouseLeave={() => setShowFull(false)}
    >
      {label && <span className="address-label">{label}</span>}
      
      <div className="address-container">
        <span className="address-text">
          {showFull ? address : formatAddress(address)}
        </span>
        
        <div className="address-actions">
          <button
            className="address-btn"
            onClick={handleCopy}
            title="Copy address"
          >
            {copied ? '✓' : '📋'}
          </button>
          
          <a
            href={`${explorerUrl}${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="address-btn"
            title="View on explorer"
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  );
};

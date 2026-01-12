import React from 'react';
import './TransactionStatus.css';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error';
  txHash?: string;
  message?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  txHash,
  message,
}) => {
  const icons = {
    pending: '⏳',
    success: '✅',
    error: '❌',
  };

  const titles = {
    pending: 'Transaction Pending',
    success: 'Transaction Successful',
    error: 'Transaction Failed',
  };

  return (
    <div className={`tx-status tx-status-${status}`}>
      <span className="tx-icon">{icons[status]}</span>
      <div className="tx-info">
        <span className="tx-title">{titles[status]}</span>
        {message && <span className="tx-message">{message}</span>}
        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View on BaseScan →
          </a>
        )}
      </div>
    </div>
  );
};

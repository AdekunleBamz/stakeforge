import React from 'react';
import './TransactionStatus.css';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error';
  txHash?: string;
  message?: string;
  onDismiss?: () => void;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'pending') {
    return (
      <div className="tx-icon-wrapper pending">
        <svg className="spinner" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div className="tx-icon-wrapper success">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
          <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="tx-icon-wrapper error">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

const titles = {
  pending: 'Transaction Pending',
  success: 'Transaction Successful',
  error: 'Transaction Failed',
};

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  txHash,
  message,
  onDismiss,
}) => {
  return (
    <div className={`tx-status tx-status-${status}`}>
      <StatusIcon status={status} />
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
            <span>View on BaseScan</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        )}
      </div>
      {onDismiss && (
        <button className="tx-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
};

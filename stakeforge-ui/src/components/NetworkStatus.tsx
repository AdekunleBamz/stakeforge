import React, { useState, useEffect } from 'react';
import './NetworkStatus.css';

interface NetworkStatusProps {
  isConnected: boolean;
  chainId?: number;
  blockNumber?: number;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isConnected,
  chainId,
  blockNumber,
}) => {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<'connected' | 'slow' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (!isConnected) {
      setStatus('disconnected');
      return;
    }

    const checkLatency = async () => {
      const start = Date.now();
      try {
        await fetch('https://mainnet.base.org', { method: 'HEAD' });
        const ping = Date.now() - start;
        setLatency(ping);
        setStatus(ping > 500 ? 'slow' : 'connected');
      } catch {
        setStatus('slow');
      }
    };

    checkLatency();
    const interval = setInterval(checkLatency, 30000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'var(--color-success)';
      case 'slow': return 'var(--color-warning)';
      default: return 'var(--color-error)';
    }
  };

  const getNetworkName = (id?: number) => {
    if (!id) return 'Unknown';
    if (id === 8453) return 'Base';
    if (id === 84532) return 'Base Sepolia';
    if (id === 1) return 'Ethereum';
    return `Chain ${id}`;
  };

  return (
    <div className="network-status">
      <div className="status-indicator" style={{ backgroundColor: getStatusColor() }} />
      <div className="status-info">
        <span className="network-name">{getNetworkName(chainId)}</span>
        {latency && <span className="latency">{latency}ms</span>}
        {blockNumber && <span className="block">Block #{blockNumber.toLocaleString()}</span>}
      </div>
    </div>
  );
};

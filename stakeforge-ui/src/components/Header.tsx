import React from 'react';
import './Header.css';

interface HeaderProps {
  address: string | null;
  isConnected: boolean;
  isCorrectChain: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onSwitchChain: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  address,
  isConnected,
  isCorrectChain,
  isConnecting,
  onConnect,
  onSwitchChain,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">⚒️</span>
          <h1>StakeForge</h1>
        </div>
        
        <nav className="nav">
          <a href="#mint" className="nav-link">Mint</a>
          <a href="#stake" className="nav-link">Stake</a>
          <a href="#rewards" className="nav-link">Rewards</a>
        </nav>

        <div className="wallet-section">
          {!isConnected ? (
            <button 
              className="connect-btn"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : !isCorrectChain ? (
            <button 
              className="switch-btn"
              onClick={onSwitchChain}
            >
              Switch to Base
            </button>
          ) : (
            <div className="wallet-info">
              <span className="chain-badge">Base</span>
              <span className="address">{formatAddress(address!)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

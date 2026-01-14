import React from 'react';
import './WalletBalance.css';
import { formatEther } from '../utils/formatters';

interface WalletBalanceProps {
  ethBalance: bigint;
  forgeBalance: bigint;
  nftCount: number;
  stakedCount: number;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  ethBalance,
  forgeBalance,
  nftCount,
  stakedCount,
}) => {
  return (
    <div className="wallet-balance">
      <div className="balance-row">
        <div className="balance-item">
          <span className="balance-icon">⟠</span>
          <div className="balance-info">
            <span className="balance-label">ETH Balance</span>
            <span className="balance-value">{formatEther(ethBalance)} ETH</span>
          </div>
        </div>
        
        <div className="balance-item">
          <span className="balance-icon">🔥</span>
          <div className="balance-info">
            <span className="balance-label">FORGE Balance</span>
            <span className="balance-value">{formatEther(forgeBalance)} FORGE</span>
          </div>
        </div>
      </div>
      
      <div className="balance-row">
        <div className="balance-item">
          <span className="balance-icon">🎨</span>
          <div className="balance-info">
            <span className="balance-label">Owned NFTs</span>
            <span className="balance-value">{nftCount}</span>
          </div>
        </div>
        
        <div className="balance-item">
          <span className="balance-icon">🔒</span>
          <div className="balance-info">
            <span className="balance-label">Staked NFTs</span>
            <span className="balance-value">{stakedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

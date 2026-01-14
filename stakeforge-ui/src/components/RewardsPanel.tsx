import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './RewardsPanel.css';

interface RewardsPanelProps {
  totalPendingRewards: bigint;
  forgeBalance: bigint;
  onClaimAll: () => Promise<string | null>;
  isClaiming: boolean;
  isConnected: boolean;
}

export const RewardsPanel: React.FC<RewardsPanelProps> = ({
  totalPendingRewards,
  forgeBalance,
  onClaimAll,
  isClaiming,
  isConnected,
}) => {
  const [displayRewards, setDisplayRewards] = useState('0.0000');

  const formatTokens = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(4);
  };

  // Animate rewards counter
  useEffect(() => {
    const target = parseFloat(ethers.formatEther(totalPendingRewards));
    setDisplayRewards(target.toFixed(4));
  }, [totalPendingRewards]);

  const hasPendingRewards = totalPendingRewards > 0n;

  return (
    <section id="rewards" className="rewards-panel">
      <div className="section-header">
        <h2>💰 Rewards</h2>
        <p>Track and claim your FORGE token rewards</p>
      </div>

      <div className="rewards-content">
        <div className="rewards-card">
          <div className="rewards-hero">
            <span className="rewards-icon">💎</span>
            <div className="rewards-amount">
              <span className="rewards-value">{displayRewards}</span>
              <span className="rewards-token">FORGE</span>
            </div>
            <span className="rewards-label">Pending Rewards</span>
          </div>

          <div className="rewards-stats">
            <div className="stat-row">
              <span className="stat-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Wallet Balance
              </span>
              <span className="stat-value">{formatTokens(forgeBalance)} FORGE</span>
            </div>
          </div>

          <button
            className="claim-btn"
            onClick={onClaimAll}
            disabled={!isConnected || isClaiming || !hasPendingRewards}
          >
            {isClaiming ? (
              <>
                <span className="btn-spinner" />
                Claiming...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v8m0 0l-4-4m4 4l4-4"/>
                  <path d="M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"/>
                </svg>
                Claim All Rewards
              </>
            )}
          </button>

          {!hasPendingRewards && isConnected && (
            <p className="no-rewards">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Stake NFTs to start earning rewards!
            </p>
          )}
        </div>

        <div className="rewards-info-card">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            How Rewards Work
          </h3>
          <ul>
            <li>
              <span className="list-icon">⚡</span>
              <span>Stake your ForgeNFTs to earn FORGE tokens</span>
            </li>
            <li>
              <span className="list-icon">📈</span>
              <span>Rewards accumulate every second automatically</span>
            </li>
            <li>
              <span className="list-icon">💎</span>
              <span>The more NFTs you stake, the more you earn</span>
            </li>
            <li>
              <span className="list-icon">🔓</span>
              <span>Claim anytime or unstake to auto-claim rewards</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

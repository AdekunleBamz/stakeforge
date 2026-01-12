import React from 'react';
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
  const formatTokens = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(4);
  };

  const hasPendingRewards = totalPendingRewards > 0n;

  return (
    <section id="rewards" className="rewards-panel">
      <div className="section-header">
        <h2>💰 Rewards</h2>
        <p>Track and claim your FORGE token rewards</p>
      </div>

      <div className="rewards-content">
        <div className="rewards-card">
          <div className="rewards-info">
            <div className="reward-item">
              <span className="reward-label">Pending Rewards</span>
              <span className="reward-value highlight">
                {formatTokens(totalPendingRewards)} FORGE
              </span>
            </div>
            <div className="reward-item">
              <span className="reward-label">Wallet Balance</span>
              <span className="reward-value">
                {formatTokens(forgeBalance)} FORGE
              </span>
            </div>
          </div>

          <button
            className="claim-btn"
            onClick={onClaimAll}
            disabled={!isConnected || isClaiming || !hasPendingRewards}
          >
            {isClaiming ? 'Claiming...' : 'Claim All Rewards'}
          </button>

          {!hasPendingRewards && isConnected && (
            <p className="no-rewards">Stake NFTs to earn rewards!</p>
          )}
        </div>

        <div className="rewards-info-card">
          <h3>How Rewards Work</h3>
          <ul>
            <li>⚡ Stake your ForgeNFTs to earn FORGE tokens</li>
            <li>📈 Rewards accumulate every second</li>
            <li>💎 The more NFTs you stake, the more you earn</li>
            <li>🔓 Claim anytime or unstake to auto-claim</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

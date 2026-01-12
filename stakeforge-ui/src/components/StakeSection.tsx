import React, { useState } from 'react';
import { ethers } from 'ethers';
import './StakeSection.css';

interface StakeInfo {
  tokenId: bigint;
  stakedAt: bigint;
  pendingRewards: bigint;
}

interface StakeSectionProps {
  ownedNFTs: bigint[];
  stakedNFTs: StakeInfo[];
  isApproved: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  onApprove: () => Promise<string | null>;
  onStake: (tokenIds: bigint[]) => Promise<string | null>;
  onUnstake: (tokenId: bigint) => Promise<string | null>;
  onClaim: (tokenId?: bigint) => Promise<string | null>;
  isConnected: boolean;
}

export const StakeSection: React.FC<StakeSectionProps> = ({
  ownedNFTs,
  stakedNFTs,
  isApproved,
  isStaking,
  isUnstaking,
  isClaiming,
  onApprove,
  onStake,
  onUnstake,
  onClaim,
  isConnected,
}) => {
  const [selectedTokens, setSelectedTokens] = useState<Set<bigint>>(new Set());
  const [isApproving, setIsApproving] = useState(false);

  const toggleToken = (tokenId: bigint) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(tokenId)) {
      newSelected.delete(tokenId);
    } else {
      newSelected.add(tokenId);
    }
    setSelectedTokens(newSelected);
  };

  const selectAll = () => {
    setSelectedTokens(new Set(ownedNFTs));
  };

  const deselectAll = () => {
    setSelectedTokens(new Set());
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await onApprove();
    setIsApproving(false);
  };

  const handleStake = async () => {
    if (selectedTokens.size === 0) return;
    await onStake(Array.from(selectedTokens));
    setSelectedTokens(new Set());
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  const formatRewards = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(6);
  };

  return (
    <section id="stake" className="stake-section">
      <div className="section-header">
        <h2>🔒 Stake Your NFTs</h2>
        <p>Stake ForgeNFTs to earn FORGE rewards</p>
      </div>

      <div className="stake-panels">
        {/* Owned NFTs Panel */}
        <div className="stake-panel">
          <div className="panel-header">
            <h3>Your NFTs ({ownedNFTs.length})</h3>
            <div className="panel-actions">
              <button className="text-btn" onClick={selectAll}>Select All</button>
              <button className="text-btn" onClick={deselectAll}>Clear</button>
            </div>
          </div>

          <div className="nft-grid">
            {ownedNFTs.length === 0 ? (
              <div className="empty-state">
                <span>No NFTs in wallet</span>
                <a href="#mint">Mint some NFTs</a>
              </div>
            ) : (
              ownedNFTs.map((tokenId) => (
                <div
                  key={tokenId.toString()}
                  className={`nft-item ${selectedTokens.has(tokenId) ? 'selected' : ''}`}
                  onClick={() => toggleToken(tokenId)}
                >
                  <div className="nft-icon">🎨</div>
                  <span className="nft-id">#{tokenId.toString()}</span>
                  {selectedTokens.has(tokenId) && <span className="check">✓</span>}
                </div>
              ))
            )}
          </div>

          <div className="stake-actions">
            {!isApproved ? (
              <button
                className="action-btn"
                onClick={handleApprove}
                disabled={!isConnected || isApproving || ownedNFTs.length === 0}
              >
                {isApproving ? 'Approving...' : 'Approve Staking'}
              </button>
            ) : (
              <button
                className="action-btn primary"
                onClick={handleStake}
                disabled={!isConnected || isStaking || selectedTokens.size === 0}
              >
                {isStaking ? 'Staking...' : `Stake ${selectedTokens.size} NFT${selectedTokens.size !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        </div>

        {/* Staked NFTs Panel */}
        <div className="stake-panel">
          <div className="panel-header">
            <h3>Staked NFTs ({stakedNFTs.length})</h3>
            {stakedNFTs.length > 0 && (
              <button
                className="claim-all-btn"
                onClick={() => onClaim()}
                disabled={!isConnected || isClaiming}
              >
                {isClaiming ? 'Claiming...' : 'Claim All'}
              </button>
            )}
          </div>

          <div className="staked-list">
            {stakedNFTs.length === 0 ? (
              <div className="empty-state">
                <span>No staked NFTs</span>
              </div>
            ) : (
              stakedNFTs.map((stake) => (
                <div key={stake.tokenId.toString()} className="staked-item">
                  <div className="staked-info">
                    <div className="staked-nft">
                      <span className="nft-icon">🔒</span>
                      <span className="nft-id">#{stake.tokenId.toString()}</span>
                    </div>
                    <div className="stake-details">
                      <span className="stake-date">Staked: {formatTime(stake.stakedAt)}</span>
                      <span className="stake-rewards">{formatRewards(stake.pendingRewards)} FORGE</span>
                    </div>
                  </div>
                  <div className="staked-actions">
                    <button
                      className="small-btn claim"
                      onClick={() => onClaim(stake.tokenId)}
                      disabled={isClaiming}
                    >
                      Claim
                    </button>
                    <button
                      className="small-btn unstake"
                      onClick={() => onUnstake(stake.tokenId)}
                      disabled={isUnstaking}
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="gas-notice">⚡ All actions use ultra-low Base gas: ~0.000005 ETH</p>
    </section>
  );
};

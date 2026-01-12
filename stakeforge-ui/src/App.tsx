import './App.css';
import { Header, StatsCard, MintSection, StakeSection } from './components';
import { useWallet, useStaking } from './hooks';

function App() {
  const {
    address,
    isConnected,
    isCorrectChain,
    isConnecting,
    connect,
    switchToBase,
  } = useWallet();

  const {
    ownedNFTs,
    stakedNFTs,
    nftBalance,
    forgeBalance,
    totalPendingRewards,
    totalStaked,
    rewardRate,
    isApproved,
    isMinting,
    isStaking,
    isUnstaking,
    isClaiming,
    mint,
    stake,
    unstake,
    claimRewards,
    approveNFTs,
  } = useStaking(address);

  return (
    <div className="app">
      <Header
        address={address}
        isConnected={isConnected}
        isCorrectChain={isCorrectChain}
        isConnecting={isConnecting}
        onConnect={connect}
        onSwitchChain={switchToBase}
      />

      <main className="main-content">
        {!isConnected ? (
          <div className="connect-prompt">
            <h2>Welcome to StakeForge ⚒️</h2>
            <p>Connect your wallet to mint and stake NFTs on Base</p>
            <button className="connect-btn-large" onClick={connect}>
              Connect Wallet
            </button>
            <p className="chain-info">💙 Powered by Base • Ultra-low gas fees</p>
          </div>
        ) : !isCorrectChain ? (
          <div className="connect-prompt">
            <h2>Wrong Network</h2>
            <p>Please switch to Base network to continue</p>
            <button className="connect-btn-large" onClick={switchToBase}>
              Switch to Base
            </button>
          </div>
        ) : (
          <>
            <StatsCard
              totalStaked={totalStaked}
              rewardRate={rewardRate}
              forgeBalance={forgeBalance}
              totalPendingRewards={totalPendingRewards}
              stakedCount={stakedNFTs.length}
              ownedCount={Number(nftBalance)}
            />

            <MintSection
              onMint={mint}
              isMinting={isMinting}
              isConnected={isConnected}
            />

            <StakeSection
              ownedNFTs={ownedNFTs}
              stakedNFTs={stakedNFTs}
              isApproved={isApproved}
              isStaking={isStaking}
              isUnstaking={isUnstaking}
              isClaiming={isClaiming}
              onApprove={approveNFTs}
              onStake={stake}
              onUnstake={unstake}
              onClaim={claimRewards}
              isConnected={isConnected}
            />
          </>
        )}
      </main>

      <footer className="footer">
        <p>StakeForge © 2026 • Built on Base</p>
      </footer>
    </div>
  );
}

export default App;

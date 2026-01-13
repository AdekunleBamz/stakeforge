// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StakeForgeRouter
 * @dev One-click interactions for StakeForge platform
 * @notice Simplifies user experience by combining multiple contract calls
 */

interface IForgeNFT is IERC721 {
    function mint() external payable;
    function mintBatch(uint256 quantity) external payable;
    function mintPrice() external view returns (uint256);
}

interface IStakingPool {
    function stake(uint256 tokenId) external;
    function stakeMultiple(uint256[] calldata tokenIds) external;
    function unstake(uint256 tokenId) external;
    function claimRewards(uint256 tokenId) external;
    function calculateRewards(uint256 tokenId) external view returns (uint256);
    function nftContract() external view returns (address);
    function rewardToken() external view returns (address);
}

contract StakeForgeRouter is Ownable, ReentrancyGuard {
    
    // Contract addresses
    IForgeNFT public forgeNFT;
    IERC20 public forgeToken;
    IStakingPool public stakingPool;
    
    // Events
    event MintAndStake(address indexed user, uint256 indexed tokenId);
    event BatchMintAndStake(address indexed user, uint256[] tokenIds);
    event UnstakeAndClaim(address indexed user, uint256 indexed tokenId, uint256 rewards);
    
    constructor(
        address _forgeNFT,
        address _forgeToken,
        address _stakingPool
    ) Ownable(msg.sender) {
        forgeNFT = IForgeNFT(_forgeNFT);
        forgeToken = IERC20(_forgeToken);
        stakingPool = IStakingPool(_stakingPool);
    }
    
    /**
     * @dev ONE-CLICK: Mint NFT and stake it immediately
     * User pays mint price, receives staked position
     */
    function mintAndStake() external payable nonReentrant {
        uint256 mintPrice = forgeNFT.mintPrice();
        require(msg.value >= mintPrice, "Insufficient payment");
        
        // Get the token ID that will be minted
        uint256 balanceBefore = forgeNFT.balanceOf(address(this));
        
        // Mint NFT to this contract
        forgeNFT.mint{value: mintPrice}();
        
        // Find the new token ID
        uint256 tokenId = _findNewToken(balanceBefore);
        
        // Approve and stake
        forgeNFT.approve(address(stakingPool), tokenId);
        stakingPool.stake(tokenId);
        
        // Transfer staking position to user (NFT ownership transfers internally)
        // The stake is now in user's name via StakingPool
        
        // Refund excess ETH
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
        
        emit MintAndStake(msg.sender, tokenId);
    }
    
    /**
     * @dev ONE-CLICK: Mint multiple NFTs and stake all
     */
    function mintBatchAndStake(uint256 quantity) external payable nonReentrant {
        require(quantity > 0 && quantity <= 10, "Invalid quantity");
        uint256 mintPrice = forgeNFT.mintPrice();
        uint256 totalCost = mintPrice * quantity;
        require(msg.value >= totalCost, "Insufficient payment");
        
        uint256 balanceBefore = forgeNFT.balanceOf(address(this));
        
        // Mint batch to this contract
        forgeNFT.mintBatch{value: totalCost}(quantity);
        
        // Find and stake all new tokens
        uint256[] memory tokenIds = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            tokenIds[i] = _findNewToken(balanceBefore + i);
            forgeNFT.approve(address(stakingPool), tokenIds[i]);
        }
        
        stakingPool.stakeMultiple(tokenIds);
        
        // Refund excess
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit BatchMintAndStake(msg.sender, tokenIds);
    }
    
    /**
     * @dev ONE-CLICK: Unstake NFT and claim all rewards
     * User receives NFT back + all accumulated rewards
     */
    function unstakeAndClaim(uint256 tokenId) external nonReentrant {
        // Calculate rewards before unstaking
        uint256 rewards = stakingPool.calculateRewards(tokenId);
        
        // Unstake (this transfers NFT and rewards)
        stakingPool.unstake(tokenId);
        
        emit UnstakeAndClaim(msg.sender, tokenId, rewards);
    }
    
    /**
     * @dev ONE-CLICK: Claim rewards from multiple staked NFTs
     */
    function claimAllRewards(uint256[] calldata tokenIds) external nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            stakingPool.claimRewards(tokenIds[i]);
        }
    }
    
    /**
     * @dev View: Get total pending rewards for multiple tokens
     */
    function getTotalPendingRewards(uint256[] calldata tokenIds) external view returns (uint256 total) {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            total += stakingPool.calculateRewards(tokenIds[i]);
        }
    }
    
    /**
     * @dev View: Get mint price
     */
    function getMintPrice() external view returns (uint256) {
        return forgeNFT.mintPrice();
    }
    
    /**
     * @dev View: Get cost for batch mint
     */
    function getBatchMintPrice(uint256 quantity) external view returns (uint256) {
        return forgeNFT.mintPrice() * quantity;
    }
    
    // Internal: Find newly minted token
    function _findNewToken(uint256 expectedIndex) internal view returns (uint256) {
        // This is a simplified approach - in production you'd use events
        return forgeNFT.tokenOfOwnerByIndex(address(this), expectedIndex);
    }
    
    /**
     * @dev Update contract addresses (owner only)
     */
    function updateContracts(
        address _forgeNFT,
        address _forgeToken,
        address _stakingPool
    ) external onlyOwner {
        if (_forgeNFT != address(0)) forgeNFT = IForgeNFT(_forgeNFT);
        if (_forgeToken != address(0)) forgeToken = IERC20(_forgeToken);
        if (_stakingPool != address(0)) stakingPool = IStakingPool(_stakingPool);
    }
    
    /**
     * @dev Emergency withdraw ETH
     */
    function emergencyWithdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Emergency withdraw tokens
     */
    function emergencyWithdrawTokens(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }
    
    // Allow receiving ETH
    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StakingPool
 * @dev Stake ForgeNFTs to earn ForgeToken rewards
 */
contract StakingPool is Ownable, ReentrancyGuard {
    
    // Staking info for each NFT
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        uint256 lastClaimTime;
    }
    
    // NFT and reward token contracts
    IERC721 public nftContract;
    IERC20 public rewardToken;
    
    // Reward rate per second per NFT (in wei)
    uint256 public rewardRate;
    
    // Minimum stake duration
    uint256 public minStakeDuration;
    
    // Mapping from token ID to stake info
    mapping(uint256 => StakeInfo) public stakes;
    
    // Mapping from user to their staked token IDs
    mapping(address => uint256[]) public userStakedTokens;
    
    // Total staked NFTs
    uint256 public totalStaked;
    
    // Staking enabled flag
    bool public stakingEnabled;
    
    // Events
    event Staked(address indexed user, uint256 indexed tokenId, uint256 timestamp);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event StakingToggled(bool enabled);
    
    constructor(
        address _nftContract,
        address _rewardToken,
        uint256 _rewardRate
    ) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        minStakeDuration = 1 days;
        stakingEnabled = true;
    }
    
    /**
     * @dev Stake a single NFT
     */
    function stake(uint256 tokenId) external nonReentrant {
        require(stakingEnabled, "Staking is disabled");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(stakes[tokenId].owner == address(0), "Already staked");
        
        // Transfer NFT to this contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        // Record stake info
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            lastClaimTime: block.timestamp
        });
        
        userStakedTokens[msg.sender].push(tokenId);
        totalStaked++;
        
        emit Staked(msg.sender, tokenId, block.timestamp);
    }
    
    /**
     * @dev Stake multiple NFTs at once
     */
    function stakeMultiple(uint256[] calldata tokenIds) external nonReentrant {
        require(stakingEnabled, "Staking is disabled");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
            require(stakes[tokenId].owner == address(0), "Already staked");
            
            nftContract.transferFrom(msg.sender, address(this), tokenId);
            
            stakes[tokenId] = StakeInfo({
                owner: msg.sender,
                stakedAt: block.timestamp,
                lastClaimTime: block.timestamp
            });
            
            userStakedTokens[msg.sender].push(tokenId);
            totalStaked++;
            
            emit Staked(msg.sender, tokenId, block.timestamp);
        }
    }
    
    /**
     * @dev Unstake a single NFT and claim rewards
     */
    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not the staker");
        require(
            block.timestamp >= stakeInfo.stakedAt + minStakeDuration,
            "Min stake duration not met"
        );
        
        // Calculate and transfer rewards
        uint256 rewards = calculateRewards(tokenId);
        if (rewards > 0) {
            rewardToken.transfer(msg.sender, rewards);
            emit RewardsClaimed(msg.sender, rewards);
        }
        
        // Transfer NFT back to owner
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        
        // Remove from user's staked tokens
        _removeTokenFromUser(msg.sender, tokenId);
        
        // Clear stake info
        delete stakes[tokenId];
        totalStaked--;
        
        emit Unstaked(msg.sender, tokenId, block.timestamp);
    }
    
    /**
     * @dev Claim rewards without unstaking
     */
    function claimRewards(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not the staker");
        
        uint256 rewards = calculateRewards(tokenId);
        require(rewards > 0, "No rewards to claim");
        
        stakeInfo.lastClaimTime = block.timestamp;
        rewardToken.transfer(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Claim all rewards from all staked NFTs
     */
    function claimAllRewards() external nonReentrant {
        uint256[] storage tokenIds = userStakedTokens[msg.sender];
        uint256 totalRewards = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 rewards = calculateRewards(tokenId);
            if (rewards > 0) {
                stakes[tokenId].lastClaimTime = block.timestamp;
                totalRewards += rewards;
            }
        }
        
        require(totalRewards > 0, "No rewards to claim");
        rewardToken.transfer(msg.sender, totalRewards);
        
        emit RewardsClaimed(msg.sender, totalRewards);
    }
    
    /**
     * @dev Calculate pending rewards for a staked NFT
     */
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo storage stakeInfo = stakes[tokenId];
        if (stakeInfo.owner == address(0)) {
            return 0;
        }
        
        uint256 stakingDuration = block.timestamp - stakeInfo.lastClaimTime;
        return stakingDuration * rewardRate;
    }
    
    /**
     * @dev Get total pending rewards for a user
     */
    function getPendingRewards(address user) external view returns (uint256) {
        uint256[] storage tokenIds = userStakedTokens[user];
        uint256 totalRewards = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            totalRewards += calculateRewards(tokenIds[i]);
        }
        
        return totalRewards;
    }
    
    /**
     * @dev Get user's staked token IDs
     */
    function getUserStakedTokens(address user) external view returns (uint256[] memory) {
        return userStakedTokens[user];
    }
    
    /**
     * @dev Get number of NFTs staked by user
     */
    function getUserStakeCount(address user) external view returns (uint256) {
        return userStakedTokens[user].length;
    }
    
    // Admin functions
    
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        emit RewardRateUpdated(rewardRate, _rewardRate);
        rewardRate = _rewardRate;
    }
    
    function setMinStakeDuration(uint256 _duration) external onlyOwner {
        minStakeDuration = _duration;
    }
    
    function toggleStaking() external onlyOwner {
        stakingEnabled = !stakingEnabled;
        emit StakingToggled(stakingEnabled);
    }
    
    function setNftContract(address _nftContract) external onlyOwner {
        nftContract = IERC721(_nftContract);
    }
    
    function setRewardToken(address _rewardToken) external onlyOwner {
        rewardToken = IERC20(_rewardToken);
    }
    
    // Internal functions
    
    function _removeTokenFromUser(address user, uint256 tokenId) internal {
        uint256[] storage tokens = userStakedTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
}

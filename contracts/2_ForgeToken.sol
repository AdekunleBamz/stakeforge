// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";

/**
 * @title ForgeToken
 * @dev ERC20 reward token for StakeForge platform
 * @notice FORGE tokens are earned by staking NFTs
 */
contract ForgeToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor(
        address initialOwner
    ) ERC20("Forge Token", "FORGE") Ownable(initialOwner) {
        // Mint initial supply to owner for liquidity/treasury
        _mint(initialOwner, 100_000_000 * 10**18); // 100M initial
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not a minter");
        _;
    }

    /**
     * @dev Add a new minter (typically the staking contract)
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid address");
        require(!minters[minter], "Already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Remove a minter
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "Not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Mint new tokens (only by minters)
     */
    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Check if address is a minter
     */
    function isMinter(address account) external view returns (bool) {
        return minters[account] || account == owner();
    }
}

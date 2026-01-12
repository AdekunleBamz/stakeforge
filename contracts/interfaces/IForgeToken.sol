// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IForgeToken
 * @dev Interface for ForgeToken contract
 */
interface IForgeToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function addMinter(address minter) external;
    function removeMinter(address minter) external;
    function isMinter(address account) external view returns (bool);
}

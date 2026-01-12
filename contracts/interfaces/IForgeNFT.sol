// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IForgeNFT
 * @dev Interface for ForgeNFT contract
 */
interface IForgeNFT {
    function mint() external payable;
    function mintBatch(uint256 quantity) external payable;
    function ownerMint(address to, uint256 quantity) external;
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function totalSupply() external view returns (uint256);
    function mintPrice() external view returns (uint256);
    function MAX_SUPPLY() external view returns (uint256);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

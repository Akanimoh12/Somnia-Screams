// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title INFTSystem
 * @notice Interface for NFT minting and management
 */
interface INFTSystem {
    function mintNFT(address player, uint8 tier) external returns (uint256 tokenId);
    function checkEligibility(address player, uint8 tier) external view returns (bool);
    function getPlayerNFTs(address player) external view returns (uint256[] memory);
    function getNFTTier(uint256 tokenId) external view returns (uint8);
    function upgradeNFT(uint256 tokenId, uint8 newTier) external;
}

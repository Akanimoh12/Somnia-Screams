// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";

/**
 * @title NFTRewards
 * @notice Tiered NFT minting system
 * @dev Manages NFT reward distribution based on achievements
 */
contract NFTRewards is GameConstants, EventEmitter {
    address public nftContract;
    address public playerProfile;
    address public leaderboard;
    
    mapping(address => mapping(uint8 => bool)) public hasClaimedTier;
    
    function setContracts(address _nft, address _profile, address _leaderboard) external {
        require(nftContract == address(0), "Already initialized");
        nftContract = _nft;
        playerProfile = _profile;
        leaderboard = _leaderboard;
    }
    
    function checkEligibility(address player, uint8 tier) public view returns (bool eligible, string memory reason) {
        if (tier == uint8(NFTTier.Bronze)) {
            return _checkBronzeEligibility(player);
        } else if (tier == uint8(NFTTier.Silver)) {
            return _checkSilverEligibility(player);
        } else if (tier == uint8(NFTTier.Gold)) {
            return _checkGoldEligibility(player);
        }
        return (false, "Invalid tier");
    }
    
    function _checkBronzeEligibility(address player) private view returns (bool, string memory) {
        (bool success, bytes memory data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLifetimePoints(address)", player)
        );
        require(success, "Profile call failed");
        
        uint256 points = abi.decode(data, (uint256));
        if (points < BRONZE_POINTS_REQUIRED) {
            return (false, "Insufficient points");
        }
        
        (success, data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLevel(address)", player)
        );
        require(success, "Level call failed");
        
        uint256 level = abi.decode(data, (uint256));
        if (level < BRONZE_LEVEL_REQUIRED) {
            return (false, "Level too low");
        }
        
        if (hasClaimedTier[player][uint8(NFTTier.Bronze)]) {
            return (false, "Already claimed");
        }
        
        return (true, "Eligible");
    }
    
    function _checkSilverEligibility(address player) private view returns (bool, string memory) {
        if (!hasClaimedTier[player][uint8(NFTTier.Bronze)]) {
            return (false, "Bronze NFT required");
        }
        
        (bool success, bytes memory data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLifetimePoints(address)", player)
        );
        require(success, "Profile call failed");
        
        uint256 points = abi.decode(data, (uint256));
        if (points < SILVER_POINTS_REQUIRED) {
            return (false, "Insufficient points");
        }
        
        (success, data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLevel(address)", player)
        );
        require(success, "Level call failed");
        
        uint256 level = abi.decode(data, (uint256));
        if (level < SILVER_LEVEL_REQUIRED) {
            return (false, "Level too low");
        }
        
        if (hasClaimedTier[player][uint8(NFTTier.Silver)]) {
            return (false, "Already claimed");
        }
        
        return (true, "Eligible");
    }
    
    function _checkGoldEligibility(address player) private view returns (bool, string memory) {
        if (!hasClaimedTier[player][uint8(NFTTier.Silver)]) {
            return (false, "Silver NFT required");
        }
        
        (bool success, bytes memory data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLifetimePoints(address)", player)
        );
        require(success, "Profile call failed");
        
        uint256 points = abi.decode(data, (uint256));
        if (points < GOLD_POINTS_REQUIRED) {
            return (false, "Insufficient points");
        }
        
        (success, data) = playerProfile.staticcall(
            abi.encodeWithSignature("getLevel(address)", player)
        );
        require(success, "Level call failed");
        
        uint256 level = abi.decode(data, (uint256));
        if (level < GOLD_LEVEL_REQUIRED) {
            return (false, "Level too low");
        }
        
        (success, data) = leaderboard.staticcall(
            abi.encodeWithSignature("getPlayerRank(address)", player)
        );
        require(success, "Leaderboard call failed");
        
        uint256 rank = abi.decode(data, (uint256));
        if (rank > GOLD_LEADERBOARD_POSITION) {
            return (false, "Not in top 100");
        }
        
        if (hasClaimedTier[player][uint8(NFTTier.Gold)]) {
            return (false, "Already claimed");
        }
        
        return (true, "Eligible");
    }
    
    function claimNFT(address player, uint8 tier) external returns (uint256 tokenId) {
        (bool eligible, string memory reason) = checkEligibility(player, tier);
        require(eligible, reason);
        
        hasClaimedTier[player][tier] = true;
        
        (bool success, bytes memory data) = nftContract.call(
            abi.encodeWithSignature("mintNFT(address,uint8)", player, tier)
        );
        require(success, "Mint failed");
        
        tokenId = abi.decode(data, (uint256));
        
        emit NFTMinted(player, tokenId, tier, block.timestamp);
        
        return tokenId;
    }
}

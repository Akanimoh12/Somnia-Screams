// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";

/**
 * @title NFTMetadata
 * @notice Dynamic on-chain metadata
 * @dev Generates metadata JSON for NFTs
 */
contract NFTMetadata is GameConstants {
    function generateMetadata(uint256 tokenId, uint8 tier, address owner) external pure returns (string memory) {
        string memory tierName = _getTierName(tier);
        string memory image = _getImageURL(tier);
        string memory attributes = _generateAttributes(tier);
        
        return string(abi.encodePacked(
            '{',
            '"name": "Somnia Screams #', _toString(tokenId), '",',
            '"description": "', tierName, ' - Halloween NFT from Somnia Screams",',
            '"image": "', image, '",',
            '"attributes": [', attributes, ']',
            '}'
        ));
    }
    
    function _getTierName(uint8 tier) private pure returns (string memory) {
        if (tier == uint8(NFTTier.Bronze)) return "Ghostly Apprentice";
        if (tier == uint8(NFTTier.Silver)) return "Soul Reaper";
        if (tier == uint8(NFTTier.Gold)) return "Manor Master";
        return "Unknown";
    }
    
    function _getImageURL(uint8 tier) private pure returns (string memory) {
        if (tier == uint8(NFTTier.Bronze)) {
            return "https://somnia-screams.io/images/bronze.png";
        }
        if (tier == uint8(NFTTier.Silver)) {
            return "https://somnia-screams.io/images/silver.png";
        }
        if (tier == uint8(NFTTier.Gold)) {
            return "https://somnia-screams.io/images/gold.png";
        }
        return "";
    }
    
    function _generateAttributes(uint8 tier) private pure returns (string memory) {
        string memory tierName = _getTierName(tier);
        string memory xpBoost = tier == uint8(NFTTier.Bronze) ? "5%" : 
                                tier == uint8(NFTTier.Silver) ? "10%" : "20%";
        string memory rarity = tier == uint8(NFTTier.Bronze) ? "Common" :
                              tier == uint8(NFTTier.Silver) ? "Rare" : "Legendary";
        
        return string(abi.encodePacked(
            '{"trait_type": "Tier", "value": "', tierName, '"},',
            '{"trait_type": "XP Boost", "value": "', xpBoost, '"},',
            '{"trait_type": "Rarity", "value": "', rarity, '"}'
        ));
    }
    
    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

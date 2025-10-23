// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";

/**
 * @title NFTRenderer
 * @notice SVG on-chain rendering (optional)
 * @dev Generates SVG artwork for NFTs
 */
contract NFTRenderer is GameConstants {
    function renderSVG(uint256 tokenId, uint8 tier) external pure returns (string memory) {
        string memory color = _getTierColor(tier);
        string memory tierName = _getTierName(tier);
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="#0a0a0a"/>',
            '<circle cx="200" cy="150" r="80" fill="', color, '" opacity="0.3"/>',
            '<text x="200" y="220" font-family="Arial" font-size="24" fill="', color, '" text-anchor="middle">',
            tierName,
            '</text>',
            '<text x="200" y="260" font-family="Arial" font-size="16" fill="#ffffff" text-anchor="middle">',
            'Somnia Screams #', _toString(tokenId),
            '</text>',
            '</svg>'
        ));
    }
    
    function _getTierColor(uint8 tier) private pure returns (string memory) {
        if (tier == uint8(NFTTier.Bronze)) return "#cd7f32";
        if (tier == uint8(NFTTier.Silver)) return "#c0c0c0";
        if (tier == uint8(NFTTier.Gold)) return "#ffd700";
        return "#ffffff";
    }
    
    function _getTierName(uint8 tier) private pure returns (string memory) {
        if (tier == uint8(NFTTier.Bronze)) return "Ghostly Apprentice";
        if (tier == uint8(NFTTier.Silver)) return "Soul Reaper";
        if (tier == uint8(NFTTier.Gold)) return "Manor Master";
        return "Unknown";
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";

/**
 * @title NFTTiers
 * @notice Bronze, Silver, Gold tier logic
 * @dev Tier validation and benefits calculation
 */
contract NFTTiers is GameConstants {
    struct TierBenefits {
        uint8 xpBoostPercent;
        uint8 soulBoostPercent;
        uint8 powerUpSlots;
        bool hasVoting;
    }
    
    mapping(uint8 => TierBenefits) public tierBenefits;
    
    constructor() {
        tierBenefits[uint8(NFTTier.Bronze)] = TierBenefits({
            xpBoostPercent: 5,
            soulBoostPercent: 0,
            powerUpSlots: 2,
            hasVoting: false
        });
        
        tierBenefits[uint8(NFTTier.Silver)] = TierBenefits({
            xpBoostPercent: 10,
            soulBoostPercent: 5,
            powerUpSlots: 3,
            hasVoting: false
        });
        
        tierBenefits[uint8(NFTTier.Gold)] = TierBenefits({
            xpBoostPercent: 20,
            soulBoostPercent: 10,
            powerUpSlots: 4,
            hasVoting: true
        });
    }
    
    function getTierBenefits(uint8 tier) external view returns (TierBenefits memory) {
        return tierBenefits[tier];
    }
    
    function calculateXPWithBoost(uint256 baseXP, uint8 tier) external view returns (uint256) {
        if (tier == 0) return baseXP;
        
        TierBenefits memory benefits = tierBenefits[tier];
        return baseXP + (baseXP * benefits.xpBoostPercent / 100);
    }
    
    function calculateSoulsWithBoost(uint256 baseSouls, uint8 tier) external view returns (uint256) {
        if (tier == 0) return baseSouls;
        
        TierBenefits memory benefits = tierBenefits[tier];
        return baseSouls + (baseSouls * benefits.soulBoostPercent / 100);
    }
    
    function getPowerUpSlots(uint8 tier) external view returns (uint8) {
        return tierBenefits[tier].powerUpSlots;
    }
    
    function hasVotingRights(uint8 tier) external view returns (bool) {
        return tierBenefits[tier].hasVoting;
    }
    
    function getTierName(uint8 tier) external pure returns (string memory) {
        if (tier == uint8(NFTTier.Bronze)) return "Ghostly Apprentice";
        if (tier == uint8(NFTTier.Silver)) return "Soul Reaper";
        if (tier == uint8(NFTTier.Gold)) return "Manor Master";
        return "None";
    }
}

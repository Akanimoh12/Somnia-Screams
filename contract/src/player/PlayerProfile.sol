// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";

/**
 * @title PlayerProfile
 * @notice Player stats, levels, achievements
 * @dev Storage-optimized player data with packed structs
 */
contract PlayerProfile is GameConstants, EventEmitter {
    struct Profile {
        uint32 level;
        uint32 totalSoulsCollected;
        uint32 battlesWon;
        uint32 roomsExplored;
        uint64 currentSessionPoints;
        uint64 lifetimePoints;
        uint64 experience;
        uint64 lastActivityTime;
        uint256 achievementFlags;
    }
    
    mapping(address => Profile) public profiles;
    
    function createProfile(address player) external {
        require(profiles[player].lastActivityTime == 0, "Profile exists");
        profiles[player] = Profile({
            level: 1,
            totalSoulsCollected: 0,
            battlesWon: 0,
            roomsExplored: 0,
            currentSessionPoints: 0,
            lifetimePoints: 0,
            experience: 0,
            lastActivityTime: uint64(block.timestamp),
            achievementFlags: 0
        });
    }
    
    function addExperience(address player, uint256 xp) external {
        Profile storage profile = profiles[player];
        profile.experience += uint64(xp);
        profile.lastActivityTime = uint64(block.timestamp);
        
        emit ExperienceGained(player, xp, profile.experience);
        
        uint256 requiredXP = getXPRequiredForLevel(profile.level + 1);
        if (profile.experience >= requiredXP) {
            _levelUp(player);
        }
    }
    
    function _levelUp(address player) private {
        Profile storage profile = profiles[player];
        profile.level++;
        
        emit LevelUp(player, profile.level, block.timestamp);
    }
    
    function addPoints(address player, uint256 points) external {
        Profile storage profile = profiles[player];
        profile.currentSessionPoints += uint64(points);
        profile.lifetimePoints += uint64(points);
        profile.lastActivityTime = uint64(block.timestamp);
    }
    
    function incrementSouls(address player, uint256 amount) external {
        profiles[player].totalSoulsCollected += uint32(amount);
        profiles[player].lastActivityTime = uint64(block.timestamp);
    }
    
    function incrementBattlesWon(address player) external {
        profiles[player].battlesWon++;
        profiles[player].lastActivityTime = uint64(block.timestamp);
    }
    
    function incrementRoomsExplored(address player) external {
        profiles[player].roomsExplored++;
        profiles[player].lastActivityTime = uint64(block.timestamp);
    }
    
    function resetSessionPoints(address player) external {
        profiles[player].currentSessionPoints = 0;
    }
    
    function unlockAchievement(address player, uint256 achievementId) external {
        require(achievementId < 256, "Invalid achievement");
        profiles[player].achievementFlags |= (1 << achievementId);
        
        emit AchievementUnlocked(player, achievementId, block.timestamp);
    }
    
    function hasAchievement(address player, uint256 achievementId) external view returns (bool) {
        return (profiles[player].achievementFlags & (1 << achievementId)) != 0;
    }
    
    function getProfile(address player) external view returns (Profile memory) {
        return profiles[player];
    }
    
    function getLevel(address player) external view returns (uint256) {
        return profiles[player].level;
    }
    
    function getLifetimePoints(address player) external view returns (uint256) {
        return profiles[player].lifetimePoints;
    }
}

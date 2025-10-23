// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EventEmitter
 * @notice Centralized event logging
 * @dev All game events for frontend tracking
 */
contract EventEmitter {
    event PlayerRegistered(address indexed player, uint256 timestamp);
    event SessionStarted(uint256 indexed sessionId, address indexed player, uint256 startTime);
    event SessionEnded(uint256 indexed sessionId, address indexed player, uint256 points, uint256 souls);
    
    event SoulCollected(address indexed player, uint256 indexed sessionId, uint256 amount);
    event SoulsBatchCollected(address indexed player, uint256 indexed sessionId, uint256 totalAmount);
    
    event RoomEntered(address indexed player, uint256 indexed roomId, uint256 timestamp);
    event RoomCompleted(address indexed player, uint256 indexed roomId, uint256 points);
    
    event BattleStarted(uint256 indexed battleId, address indexed player, uint256 enemyType);
    event BattleEnded(uint256 indexed battleId, address indexed player, bool victory, uint256 rewards);
    
    event LevelUp(address indexed player, uint256 newLevel, uint256 timestamp);
    event ExperienceGained(address indexed player, uint256 amount, uint256 totalXP);
    
    event AchievementUnlocked(address indexed player, uint256 indexed achievementId, uint256 timestamp);
    
    event NFTMinted(address indexed player, uint256 indexed tokenId, uint8 tier, uint256 timestamp);
    event NFTTierUpgraded(address indexed player, uint256 indexed tokenId, uint8 newTier);
    
    event LeaderboardUpdated(address indexed player, uint256 newRank, uint256 totalPoints);
    
    event PowerUpActivated(address indexed player, uint256 powerUpId, uint256 duration);
    event PowerUpExpired(address indexed player, uint256 powerUpId);
    
    event QuestCompleted(address indexed player, uint256 indexed questId, uint256 rewards);
    event DailyQuestReset(uint256 timestamp);
    
    event RewardsClaimed(address indexed player, uint256 amount, uint256 timestamp);
}

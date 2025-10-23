// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";

/**
 * @title DailyQuests
 * @notice Daily and weekly challenges
 * @dev Time-based quest system with rewards
 */
contract DailyQuests is GameConstants, EventEmitter {
    struct Quest {
        uint8 questType;
        uint16 targetValue;
        uint16 rewardPoints;
        uint32 startTime;
        uint32 endTime;
        bool active;
    }
    
    struct PlayerQuestProgress {
        uint16 currentValue;
        bool completed;
        bool claimed;
    }
    
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => PlayerQuestProgress)) public playerProgress;
    
    uint256 public questCounter;
    uint256 public lastDailyReset;
    uint256 public lastWeeklyReset;
    
    constructor() {
        lastDailyReset = block.timestamp;
        lastWeeklyReset = block.timestamp;
    }
    
    function createQuest(
        uint8 questType,
        uint16 targetValue,
        uint16 rewardPoints,
        uint32 duration
    ) external returns (uint256 questId) {
        questCounter++;
        questId = questCounter;
        
        quests[questId] = Quest({
            questType: questType,
            targetValue: targetValue,
            rewardPoints: rewardPoints,
            startTime: uint32(block.timestamp),
            endTime: uint32(block.timestamp + duration),
            active: true
        });
        
        return questId;
    }
    
    function updateProgress(address player, uint256 questId, uint16 increment) external {
        Quest storage quest = quests[questId];
        require(quest.active, "Quest not active");
        require(block.timestamp <= quest.endTime, "Quest expired");
        
        PlayerQuestProgress storage progress = playerProgress[player][questId];
        require(!progress.completed, "Already completed");
        
        progress.currentValue += increment;
        
        if (progress.currentValue >= quest.targetValue) {
            progress.completed = true;
            emit QuestCompleted(player, questId, quest.rewardPoints);
        }
    }
    
    function claimReward(address player, uint256 questId) external returns (uint256 reward) {
        PlayerQuestProgress storage progress = playerProgress[player][questId];
        require(progress.completed, "Not completed");
        require(!progress.claimed, "Already claimed");
        
        progress.claimed = true;
        reward = quests[questId].rewardPoints;
        
        emit RewardsClaimed(player, reward, block.timestamp);
        
        return reward;
    }
    
    function checkDailyReset() external {
        if (block.timestamp >= lastDailyReset + 1 days) {
            lastDailyReset = block.timestamp;
            emit DailyQuestReset(block.timestamp);
        }
    }
    
    function getQuestData(uint256 questId) external view returns (Quest memory) {
        return quests[questId];
    }
    
    function getPlayerProgress(address player, uint256 questId) external view returns (PlayerQuestProgress memory) {
        return playerProgress[player][questId];
    }
    
    function isQuestActive(uint256 questId) external view returns (bool) {
        Quest storage quest = quests[questId];
        return quest.active && block.timestamp <= quest.endTime;
    }
}

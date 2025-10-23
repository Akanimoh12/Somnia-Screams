// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/AccessControl.sol";
import "../utils/EventEmitter.sol";

/**
 * @title SeasonalRewards
 * @notice Halloween-specific rewards
 * @dev Time-limited seasonal reward distribution
 */
contract SeasonalRewards is AccessControl, EventEmitter {
    struct Season {
        uint256 startTime;
        uint256 endTime;
        uint256 rewardPool;
        uint256 participantCount;
        bool active;
    }
    
    mapping(uint256 => Season) public seasons;
    mapping(uint256 => mapping(address => uint256)) public seasonRewards;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    
    uint256 public currentSeason;
    
    function createSeason(uint256 seasonId, uint256 startTime, uint256 endTime, uint256 rewardPool) external onlyAdmin {
        seasons[seasonId] = Season({
            startTime: startTime,
            endTime: endTime,
            rewardPool: rewardPool,
            participantCount: 0,
            active: true
        });
        currentSeason = seasonId;
    }
    
    function allocateReward(uint256 seasonId, address player, uint256 amount) external onlyOperator {
        require(seasons[seasonId].active, "Season not active");
        require(block.timestamp <= seasons[seasonId].endTime, "Season ended");
        
        if (seasonRewards[seasonId][player] == 0) {
            seasons[seasonId].participantCount++;
        }
        
        seasonRewards[seasonId][player] += amount;
    }
    
    function claimSeasonalReward(uint256 seasonId) external returns (uint256 reward) {
        require(block.timestamp > seasons[seasonId].endTime, "Season not ended");
        require(!hasClaimed[seasonId][msg.sender], "Already claimed");
        require(seasonRewards[seasonId][msg.sender] > 0, "No rewards");
        
        reward = seasonRewards[seasonId][msg.sender];
        hasClaimed[seasonId][msg.sender] = true;
        
        emit RewardsClaimed(msg.sender, reward, block.timestamp);
        
        return reward;
    }
    
    function getSeasonData(uint256 seasonId) external view returns (Season memory) {
        return seasons[seasonId];
    }
    
    function getPlayerSeasonReward(uint256 seasonId, address player) external view returns (uint256) {
        return seasonRewards[seasonId][player];
    }
    
    function endSeason(uint256 seasonId) external onlyAdmin {
        seasons[seasonId].active = false;
    }
}

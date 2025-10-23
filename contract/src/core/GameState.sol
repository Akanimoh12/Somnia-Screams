// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";

/**
 * @title GameState
 * @notice Game state and round management
 * @dev Manages global game state and phases
 */
contract GameState is GameConstants {
    struct GlobalState {
        uint256 totalSessions;
        uint256 activeSessions;
        uint256 totalPlayers;
        uint256 totalSoulsCollected;
        uint256 totalBattles;
        bool maintenanceMode;
    }
    
    GlobalState public globalState;
    
    mapping(uint256 => GamePhase) public sessionPhase;
    mapping(uint256 => uint256) public sessionStartTime;
    
    function incrementTotalSessions() external {
        globalState.totalSessions++;
    }
    
    function incrementActiveSessions() external {
        globalState.activeSessions++;
    }
    
    function decrementActiveSessions() external {
        if (globalState.activeSessions > 0) {
            globalState.activeSessions--;
        }
    }
    
    function incrementTotalPlayers() external {
        globalState.totalPlayers++;
    }
    
    function addSoulsCollected(uint256 amount) external {
        globalState.totalSoulsCollected += amount;
    }
    
    function incrementTotalBattles() external {
        globalState.totalBattles++;
    }
    
    function setSessionPhase(uint256 sessionId, GamePhase phase) external {
        sessionPhase[sessionId] = phase;
    }
    
    function setSessionStartTime(uint256 sessionId, uint256 startTime) external {
        sessionStartTime[sessionId] = startTime;
    }
    
    function getCurrentPhase(uint256 sessionId) external view returns (GamePhase) {
        uint256 elapsed = block.timestamp - sessionStartTime[sessionId];
        
        if (elapsed < PRE_GAME_PHASE) {
            return GamePhase.PreGame;
        } else if (elapsed < PRE_GAME_PHASE + EXPLORATION_PHASE) {
            return GamePhase.Exploration;
        } else if (elapsed < PRE_GAME_PHASE + EXPLORATION_PHASE + BATTLE_PHASE) {
            return GamePhase.Battle;
        } else {
            return GamePhase.Rewards;
        }
    }
    
    function getGlobalState() external view returns (GlobalState memory) {
        return globalState;
    }
    
    function setMaintenanceMode(bool enabled) external {
        globalState.maintenanceMode = enabled;
    }
    
    function isInMaintenance() external view returns (bool) {
        return globalState.maintenanceMode;
    }
}

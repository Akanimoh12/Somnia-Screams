// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/RandomGenerator.sol";
import "../utils/EventEmitter.sol";

/**
 * @title SpectralBattles
 * @notice 2-minute battle challenges
 * @dev Combat system with 30-second battle phases
 */
contract SpectralBattles is GameConstants, RandomGenerator, EventEmitter {
    struct Battle {
        address player;
        uint256 startTime;
        uint8 enemyType;
        uint16 enemyPower;
        uint16 playerPower;
        bool active;
        bool victory;
    }
    
    mapping(uint256 => Battle) public battles;
    mapping(address => uint256) public activeBattles;
    mapping(address => uint256) public totalBattles;
    mapping(address => uint256) public battlesWon;
    
    uint256 public battleCounter;
    
    function startBattle(address player, uint256 roomId) external returns (uint256 battleId) {
        require(activeBattles[player] == 0, "Already in battle");
        
        battleCounter++;
        battleId = battleCounter;
        
        uint8 enemyType = uint8(roomId % 5);
        uint16 enemyPower = uint16(100 + random(100, player));
        uint16 playerPower = uint16(100 + random(100, player));
        
        battles[battleId] = Battle({
            player: player,
            startTime: block.timestamp,
            enemyType: enemyType,
            enemyPower: enemyPower,
            playerPower: playerPower,
            active: true,
            victory: false
        });
        
        activeBattles[player] = battleId;
        totalBattles[player]++;
        
        emit BattleStarted(battleId, player, enemyType);
        
        return battleId;
    }
    
    function resolveBattle(uint256 battleId) external returns (bool victory, uint256 rewards) {
        Battle storage battle = battles[battleId];
        require(battle.active, "Battle not active");
        require(block.timestamp >= battle.startTime + BATTLE_PHASE, "Battle in progress");
        
        victory = battle.playerPower >= battle.enemyPower;
        battle.victory = victory;
        battle.active = false;
        
        activeBattles[battle.player] = 0;
        
        if (victory) {
            battlesWon[battle.player]++;
            rewards = SOUL_BASE_POINTS * BATTLE_WIN_MULTIPLIER / 100;
        } else {
            rewards = SOUL_BASE_POINTS / 2;
        }
        
        emit BattleEnded(battleId, battle.player, victory, rewards);
        
        return (victory, rewards);
    }
    
    function getBattleData(uint256 battleId) external view returns (Battle memory) {
        return battles[battleId];
    }
    
    function getPlayerBattleStats(address player) external view returns (uint256 total, uint256 won) {
        return (totalBattles[player], battlesWon[player]);
    }
    
    function isInBattle(address player) external view returns (bool) {
        return activeBattles[player] != 0;
    }
}

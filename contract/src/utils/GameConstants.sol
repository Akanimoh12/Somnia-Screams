// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GameConstants
 * @notice Game configuration constants
 * @dev Centralized constants for all game parameters
 */
contract GameConstants {
    uint256 public constant SESSION_DURATION = 2 minutes;
    uint256 public constant EXPLORATION_PHASE = 90 seconds;
    uint256 public constant BATTLE_PHASE = 30 seconds;
    uint256 public constant PRE_GAME_PHASE = 30 seconds;
    
    uint256 public constant MAX_ROOMS = 50;
    uint256 public constant MAX_LEVEL = 100;
    uint256 public constant BATCH_SOUL_LIMIT = 10;
    
    uint256 public constant BRONZE_POINTS_REQUIRED = 1000;
    uint256 public constant SILVER_POINTS_REQUIRED = 5000;
    uint256 public constant GOLD_POINTS_REQUIRED = 10000;
    
    uint256 public constant BRONZE_LEVEL_REQUIRED = 10;
    uint256 public constant SILVER_LEVEL_REQUIRED = 25;
    uint256 public constant GOLD_LEVEL_REQUIRED = 50;
    
    uint256 public constant SILVER_BATTLES_REQUIRED = 10;
    uint256 public constant GOLD_LEADERBOARD_POSITION = 100;
    
    uint256 public constant BASE_XP_PER_LEVEL = 100;
    uint256 public constant XP_MULTIPLIER_TIER1 = 100;
    uint256 public constant XP_MULTIPLIER_TIER2 = 250;
    uint256 public constant XP_MULTIPLIER_TIER3 = 500;
    uint256 public constant XP_MULTIPLIER_TIER4 = 1000;
    
    uint256 public constant SOUL_BASE_POINTS = 10;
    uint256 public constant BATTLE_WIN_MULTIPLIER = 150;
    uint256 public constant ROOM_EXPLORATION_POINTS = 5;
    
    uint256 public constant MAX_POWER_UPS = 4;
    uint256 public constant POWER_UP_DURATION = 30 seconds;
    
    uint256 public constant GAS_LIMIT_ACTION = 100000;
    uint256 public constant GAS_LIMIT_BATCH = 200000;
    
    enum GamePhase {
        PreGame,
        Exploration,
        Battle,
        Rewards
    }
    
    enum PlayerTier {
        GhostlyApprentice,
        SoulSeeker,
        SpiritWarrior,
        ManorMaster
    }
    
    enum NFTTier {
        None,
        Bronze,
        Silver,
        Gold
    }
    
    enum ChallengeType {
        RoomExploration,
        SpectralBattle,
        SoulCollection,
        PuzzleSolving,
        SurvivalMode
    }
    
    function getXPRequiredForLevel(uint256 level) public pure returns (uint256) {
        if (level <= 10) return level * XP_MULTIPLIER_TIER1;
        if (level <= 25) return level * XP_MULTIPLIER_TIER2;
        if (level <= 50) return level * XP_MULTIPLIER_TIER3;
        return level * XP_MULTIPLIER_TIER4;
    }
    
    function getPlayerTier(uint256 level) public pure returns (PlayerTier) {
        if (level <= 10) return PlayerTier.GhostlyApprentice;
        if (level <= 25) return PlayerTier.SoulSeeker;
        if (level <= 50) return PlayerTier.SpiritWarrior;
        return PlayerTier.ManorMaster;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../interfaces/IRewardSystem.sol";

/**
 * @title PointsSystem
 * @notice EXP, souls, and scoring logic
 * @dev Centralized points and experience calculation
 */
contract PointsSystem is GameConstants, IRewardSystem {
    address public playerProfile;
    
    modifier onlyAuthorized() {
        require(playerProfile != address(0), "Not initialized");
        _;
    }
    
    function setPlayerProfile(address _playerProfile) external {
        require(playerProfile == address(0), "Already set");
        playerProfile = _playerProfile;
    }
    
    function addPoints(address player, uint256 amount) external override onlyAuthorized {
        (bool success,) = playerProfile.call(
            abi.encodeWithSignature("addPoints(address,uint256)", player, amount)
        );
        require(success, "Add points failed");
    }
    
    function addExperience(address player, uint256 amount) external override onlyAuthorized {
        (bool success,) = playerProfile.call(
            abi.encodeWithSignature("addExperience(address,uint256)", player, amount)
        );
        require(success, "Add XP failed");
    }
    
    function calculateRewards(uint256 sessionId) external view override returns (uint256 points, uint256 xp) {
        points = 100;
        xp = 50;
        return (points, xp);
    }
    
    function distributeRewards(address player, uint256 points, uint256 xp) external override onlyAuthorized {
        (bool success,) = playerProfile.call(
            abi.encodeWithSignature("addPoints(address,uint256)", player, points)
        );
        require(success, "Add points failed");
        
        (success,) = playerProfile.call(
            abi.encodeWithSignature("addExperience(address,uint256)", player, xp)
        );
        require(success, "Add XP failed");
    }
    
    function getPlayerPoints(address player) external view override returns (uint256 sessionPoints, uint256 lifetimePoints) {
        (bool success, bytes memory data) = playerProfile.staticcall(
            abi.encodeWithSignature("getProfile(address)", player)
        );
        require(success, "Get profile failed");
        
        (,,,, uint64 current, uint64 lifetime,,, ) = abi.decode(
            data,
            (uint32, uint32, uint32, uint32, uint64, uint64, uint64, uint64, uint256)
        );
        
        return (current, lifetime);
    }
    
    function calculateSoulPoints(uint256 soulCount) external pure returns (uint256) {
        return soulCount * SOUL_BASE_POINTS;
    }
    
    function calculateBattleReward(bool victory) external pure returns (uint256) {
        return victory ? SOUL_BASE_POINTS * BATTLE_WIN_MULTIPLIER / 100 : SOUL_BASE_POINTS / 2;
    }
    
    function calculateRoomReward(uint256 difficulty, bool firstTime) external pure returns (uint256) {
        uint256 baseReward = ROOM_EXPLORATION_POINTS * difficulty;
        return firstTime ? baseReward * 2 : baseReward;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRewardSystem
 * @notice Reward distribution interface
 * @dev Interface for points, XP, and rewards
 */
interface IRewardSystem {
    function addPoints(address player, uint256 amount) external;
    function addExperience(address player, uint256 amount) external;
    function calculateRewards(uint256 sessionId) external view returns (uint256 points, uint256 xp);
    function distributeRewards(address player, uint256 points, uint256 xp) external;
    function getPlayerPoints(address player) external view returns (uint256 sessionPoints, uint256 lifetimePoints);
}

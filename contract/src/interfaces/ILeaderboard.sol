// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ILeaderboard
 * @notice Leaderboard ranking interface
 * @dev Interface for player rankings and leaderboard queries
 */
interface ILeaderboard {
    function updatePlayerScore(address player, uint256 points) external;
    function getPlayerRank(address player) external view returns (uint256);
    function getTopPlayers(uint256 count) external view returns (address[] memory, uint256[] memory);
    function getLeaderboardPage(uint256 offset, uint256 limit) external view returns (address[] memory, uint256[] memory);
}

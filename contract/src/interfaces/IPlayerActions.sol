// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPlayerActions
 * @notice Player action interface
 * @dev Interface for all player actions in the game
 */
interface IPlayerActions {
    function moveToRoom(uint256 sessionId, uint256 roomId) external;
    function collectSoul(uint256 sessionId) external;
    function triggerBattle(uint256 sessionId) external;
    function usePowerUp(uint256 sessionId, uint256 powerUpId) external;
    function solvePuzzle(uint256 sessionId, uint256 puzzleId, bytes32 solution) external;
}

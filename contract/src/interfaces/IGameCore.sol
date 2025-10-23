// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IGameCore
 * @notice Core game interface
 * @dev Interface for main game controller functions
 */
interface IGameCore {
    function startGameSession() external returns (uint256 sessionId);
    function joinActiveSession(uint256 sessionId) external;
    function exitSession(uint256 sessionId) external;
    function claimSessionRewards(uint256 sessionId) external;
    function getCurrentPhase(uint256 sessionId) external view returns (uint8);
    function getSessionData(uint256 sessionId) external view returns (
        address player,
        uint256 startTime,
        uint256 points,
        uint256 soulsCollected,
        bool active
    );
}

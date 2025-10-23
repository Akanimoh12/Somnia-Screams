// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IBatchProcessor
 * @notice Batch action processing interface
 * @dev Interface for batching multiple actions in single transaction
 */
interface IBatchProcessor {
    function batchCollectSouls(uint256 sessionId, uint256 count) external;
    function batchPerformActions(uint256 sessionId, uint8[] calldata actionTypes, bytes[] calldata actionData) external;
}

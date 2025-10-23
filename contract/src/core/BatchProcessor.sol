// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../interfaces/IBatchProcessor.sol";

/**
 * @title BatchProcessor
 * @notice Batch multiple actions in single transaction
 * @dev Optimizes gas by batching operations
 */
contract BatchProcessor is GameConstants, IBatchProcessor {
    address public gameCore;
    address public soulCollector;
    
    modifier onlyGameCore() {
        require(msg.sender == gameCore, "Only game core");
        _;
    }
    
    function setContracts(address _gameCore, address _soulCollector) external {
        require(gameCore == address(0), "Already initialized");
        gameCore = _gameCore;
        soulCollector = _soulCollector;
    }
    
    function batchCollectSouls(uint256 sessionId, uint256 count) external override {
        require(count <= BATCH_SOUL_LIMIT, "Exceeds batch limit");
        
        (bool success,) = soulCollector.call(
            abi.encodeWithSignature(
                "batchCollectSouls(address,uint256,uint256)",
                msg.sender,
                sessionId,
                count
            )
        );
        require(success, "Batch collect failed");
    }
    
    function batchPerformActions(
        uint256 sessionId,
        uint8[] calldata actionTypes,
        bytes[] calldata actionData
    ) external override {
        require(actionTypes.length == actionData.length, "Length mismatch");
        require(actionTypes.length <= 10, "Too many actions");
        
        for (uint256 i = 0; i < actionTypes.length; i++) {
            _processAction(sessionId, actionTypes[i], actionData[i]);
        }
    }
    
    function _processAction(uint256 sessionId, uint8 actionType, bytes calldata data) private {
        if (actionType == 0) {
            uint256 roomId = abi.decode(data, (uint256));
            (bool success,) = gameCore.call(
                abi.encodeWithSignature("moveToRoom(uint256,uint256)", sessionId, roomId)
            );
            require(success, "Move failed");
        } else if (actionType == 1) {
            (bool success,) = gameCore.call(
                abi.encodeWithSignature("collectSoul(uint256)", sessionId)
            );
            require(success, "Collect failed");
        } else if (actionType == 2) {
            (bool success,) = gameCore.call(
                abi.encodeWithSignature("triggerBattle(uint256)", sessionId)
            );
            require(success, "Battle failed");
        } else if (actionType == 3) {
            uint256 powerUpId = abi.decode(data, (uint256));
            (bool success,) = gameCore.call(
                abi.encodeWithSignature("usePowerUp(uint256,uint256)", sessionId, powerUpId)
            );
            require(success, "PowerUp failed");
        }
    }
}

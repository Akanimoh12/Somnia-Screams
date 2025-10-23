// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title EmergencyPause
 * @notice Circuit breaker for critical bugs
 * @dev Pausable functionality for emergency situations
 */
contract EmergencyPause is AccessControl {
    bool public paused;
    
    event Paused(address indexed admin);
    event Unpaused(address indexed admin);
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused, "Contract not paused");
        _;
    }
    
    function pause() external onlyAdmin {
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() external onlyAdmin {
        paused = false;
        emit Unpaused(msg.sender);
    }
}

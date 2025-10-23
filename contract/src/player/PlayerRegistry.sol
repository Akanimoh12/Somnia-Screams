// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/EventEmitter.sol";

/**
 * @title PlayerRegistry
 * @notice Player registration and profile lookup
 * @dev Manages player registration and basic lookups
 */
contract PlayerRegistry is EventEmitter {
    mapping(address => bool) public isRegistered;
    mapping(address => uint256) public registrationTime;
    address[] public allPlayers;
    
    function register() external {
        require(!isRegistered[msg.sender], "Already registered");
        
        isRegistered[msg.sender] = true;
        registrationTime[msg.sender] = block.timestamp;
        allPlayers.push(msg.sender);
        
        emit PlayerRegistered(msg.sender, block.timestamp);
    }
    
    function getPlayerCount() external view returns (uint256) {
        return allPlayers.length;
    }
    
    function getPlayerByIndex(uint256 index) external view returns (address) {
        require(index < allPlayers.length, "Index out of bounds");
        return allPlayers[index];
    }
    
    function checkRegistration(address player) external view returns (bool) {
        return isRegistered[player];
    }
}

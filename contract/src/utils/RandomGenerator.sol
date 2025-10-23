// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RandomGenerator
 * @notice Pseudo-random number generation for game mechanics
 * @dev Uses blockhash and player data for randomness - not for critical security
 */
contract RandomGenerator {
    uint256 private nonce;
    
    function random(uint256 max, address player) internal returns (uint256) {
        nonce++;
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            player,
            nonce
        ))) % max;
    }
    
    function randomInRange(uint256 min, uint256 max, address player) internal returns (uint256) {
        require(max > min, "Invalid range");
        return min + random(max - min + 1, player);
    }
    
    function randomBool(address player) internal returns (bool) {
        return random(2, player) == 1;
    }
    
    function randomFromArray(uint256[] memory array, address player) internal returns (uint256) {
        require(array.length > 0, "Empty array");
        return array[random(array.length, player)];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PlayerInventory
 * @notice Items, souls, power-ups storage
 * @dev Manages player inventory and consumables
 */
contract PlayerInventory {
    struct Inventory {
        uint256 souls;
        uint256[] powerUpIds;
        uint256[] itemIds;
        mapping(uint256 => uint256) powerUpExpiry;
        mapping(uint256 => uint256) itemQuantity;
    }
    
    mapping(address => Inventory) private inventories;
    
    function addSouls(address player, uint256 amount) external {
        inventories[player].souls += amount;
    }
    
    function removeSouls(address player, uint256 amount) external {
        require(inventories[player].souls >= amount, "Insufficient souls");
        inventories[player].souls -= amount;
    }
    
    function getSouls(address player) external view returns (uint256) {
        return inventories[player].souls;
    }
    
    function addPowerUp(address player, uint256 powerUpId, uint256 duration) external {
        Inventory storage inv = inventories[player];
        inv.powerUpIds.push(powerUpId);
        inv.powerUpExpiry[powerUpId] = block.timestamp + duration;
    }
    
    function isPowerUpActive(address player, uint256 powerUpId) external view returns (bool) {
        return inventories[player].powerUpExpiry[powerUpId] > block.timestamp;
    }
    
    function getActivePowerUps(address player) external view returns (uint256[] memory) {
        Inventory storage inv = inventories[player];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < inv.powerUpIds.length; i++) {
            if (inv.powerUpExpiry[inv.powerUpIds[i]] > block.timestamp) {
                activeCount++;
            }
        }
        
        uint256[] memory activePowerUps = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < inv.powerUpIds.length; i++) {
            uint256 powerUpId = inv.powerUpIds[i];
            if (inv.powerUpExpiry[powerUpId] > block.timestamp) {
                activePowerUps[index] = powerUpId;
                index++;
            }
        }
        
        return activePowerUps;
    }
    
    function addItem(address player, uint256 itemId, uint256 quantity) external {
        Inventory storage inv = inventories[player];
        if (inv.itemQuantity[itemId] == 0) {
            inv.itemIds.push(itemId);
        }
        inv.itemQuantity[itemId] += quantity;
    }
    
    function removeItem(address player, uint256 itemId, uint256 quantity) external {
        Inventory storage inv = inventories[player];
        require(inv.itemQuantity[itemId] >= quantity, "Insufficient items");
        inv.itemQuantity[itemId] -= quantity;
    }
    
    function getItemQuantity(address player, uint256 itemId) external view returns (uint256) {
        return inventories[player].itemQuantity[itemId];
    }
    
    function getAllItems(address player) external view returns (uint256[] memory, uint256[] memory) {
        Inventory storage inv = inventories[player];
        uint256 length = inv.itemIds.length;
        uint256[] memory ids = new uint256[](length);
        uint256[] memory quantities = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            ids[i] = inv.itemIds[i];
            quantities[i] = inv.itemQuantity[inv.itemIds[i]];
        }
        
        return (ids, quantities);
    }
}

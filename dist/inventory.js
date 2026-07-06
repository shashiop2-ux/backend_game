"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToInventory = addToInventory;
exports.hasInInventory = hasInInventory;
exports.removeFromInventory = removeFromInventory;
const shared_1 = require("shared");
/**
 * Attempts to add items to an inventory (mutating the array in place).
 * Respects stack size limits.
 * @returns true if at least one item was added, false if completely full.
 */
function addToInventory(inventory, itemId, count) {
    const meta = shared_1.ITEM_METADATA[itemId];
    if (!meta || itemId === shared_1.ItemId.NONE)
        return false;
    let remaining = count;
    // 1. Try to stack onto existing items
    for (const slot of inventory) {
        if (slot.itemId === itemId && slot.count < meta.maxStack) {
            const space = meta.maxStack - slot.count;
            const toAdd = Math.min(space, remaining);
            slot.count += toAdd;
            remaining -= toAdd;
            if (remaining <= 0)
                return true;
        }
    }
    // 2. Try to fill empty slots
    for (const slot of inventory) {
        if (slot.itemId === shared_1.ItemId.NONE || slot.count <= 0) {
            slot.itemId = itemId;
            slot.count = Math.min(meta.maxStack, remaining);
            remaining -= slot.count;
            if (remaining <= 0)
                return true;
        }
    }
    return remaining < count; // True if we successfully inserted at least one item
}
/**
 * Checks if the inventory contains at least the specified quantity of an item.
 */
function hasInInventory(inventory, itemId, count) {
    if (itemId === shared_1.ItemId.NONE)
        return true;
    let total = 0;
    for (const slot of inventory) {
        if (slot.itemId === itemId) {
            total += slot.count;
        }
    }
    return total >= count;
}
/**
 * Deducts a specified quantity of an item from the inventory (mutating the array in place).
 * @returns true if successfully removed, false if not enough items were present.
 */
function removeFromInventory(inventory, itemId, count) {
    if (!hasInInventory(inventory, itemId, count))
        return false;
    let remaining = count;
    for (const slot of inventory) {
        if (slot.itemId === itemId) {
            if (slot.count >= remaining) {
                slot.count -= remaining;
                remaining = 0;
            }
            else {
                remaining -= slot.count;
                slot.count = 0;
            }
            // Reset empty slot to NONE
            if (slot.count === 0) {
                slot.itemId = shared_1.ItemId.NONE;
            }
            if (remaining <= 0)
                break;
        }
    }
    return true;
}

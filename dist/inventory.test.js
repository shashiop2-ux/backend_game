"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const inventory_1 = require("./inventory");
const shared_1 = require("shared");
(0, vitest_1.describe)('Inventory System', () => {
    const createEmptyInventory = () => Array.from({ length: 5 }, () => ({ itemId: shared_1.ItemId.NONE, count: 0 }));
    (0, vitest_1.it)('should add items to empty slots', () => {
        const inv = createEmptyInventory();
        const success = (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 10);
        (0, vitest_1.expect)(success).toBe(true);
        (0, vitest_1.expect)(inv[0].itemId).toBe(shared_1.ItemId.WOOD);
        (0, vitest_1.expect)(inv[0].count).toBe(10);
    });
    (0, vitest_1.it)('should stack items of the same type', () => {
        const inv = createEmptyInventory();
        (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 10);
        const success = (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 15);
        (0, vitest_1.expect)(success).toBe(true);
        (0, vitest_1.expect)(inv[0].itemId).toBe(shared_1.ItemId.WOOD);
        (0, vitest_1.expect)(inv[0].count).toBe(25);
        (0, vitest_1.expect)(inv[1].itemId).toBe(shared_1.ItemId.NONE); // No new slot used
    });
    (0, vitest_1.it)('should split stacks when max stack is exceeded', () => {
        const inv = createEmptyInventory();
        // Wood maxStack is 64
        (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 50);
        const success = (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 20); // Total 70
        (0, vitest_1.expect)(success).toBe(true);
        (0, vitest_1.expect)(inv[0].itemId).toBe(shared_1.ItemId.WOOD);
        (0, vitest_1.expect)(inv[0].count).toBe(64); // Filled first slot
        (0, vitest_1.expect)(inv[1].itemId).toBe(shared_1.ItemId.WOOD);
        (0, vitest_1.expect)(inv[1].count).toBe(6); // Remaining in second slot
    });
    (0, vitest_1.it)('should fail to add items if inventory is full', () => {
        const inv = createEmptyInventory();
        // Fill all 5 slots
        for (let i = 0; i < 5; i++) {
            inv[i] = { itemId: shared_1.ItemId.STONE, count: 64 };
        }
        const success = (0, inventory_1.addToInventory)(inv, shared_1.ItemId.WOOD, 5);
        (0, vitest_1.expect)(success).toBe(false);
    });
    (0, vitest_1.it)('should check if inventory has items', () => {
        const inv = createEmptyInventory();
        inv[0] = { itemId: shared_1.ItemId.WOOD, count: 10 };
        inv[1] = { itemId: shared_1.ItemId.WOOD, count: 5 };
        (0, vitest_1.expect)((0, inventory_1.hasInInventory)(inv, shared_1.ItemId.WOOD, 12)).toBe(true);
        (0, vitest_1.expect)((0, inventory_1.hasInInventory)(inv, shared_1.ItemId.WOOD, 16)).toBe(false);
        (0, vitest_1.expect)((0, inventory_1.hasInInventory)(inv, shared_1.ItemId.STONE, 1)).toBe(false);
    });
    (0, vitest_1.it)('should remove items correctly', () => {
        const inv = createEmptyInventory();
        inv[0] = { itemId: shared_1.ItemId.WOOD, count: 10 };
        inv[1] = { itemId: shared_1.ItemId.WOOD, count: 5 };
        const success = (0, inventory_1.removeFromInventory)(inv, shared_1.ItemId.WOOD, 12);
        (0, vitest_1.expect)(success).toBe(true);
        // Remaining should be 3
        (0, vitest_1.expect)(inv[0].itemId).toBe(shared_1.ItemId.NONE); // First slot emptied
        (0, vitest_1.expect)(inv[1].itemId).toBe(shared_1.ItemId.WOOD);
        (0, vitest_1.expect)(inv[1].count).toBe(3); // Second slot has the rest
    });
    (0, vitest_1.it)('should fail to remove items if not enough are present', () => {
        const inv = createEmptyInventory();
        inv[0] = { itemId: shared_1.ItemId.WOOD, count: 10 };
        const success = (0, inventory_1.removeFromInventory)(inv, shared_1.ItemId.WOOD, 12);
        (0, vitest_1.expect)(success).toBe(false);
        (0, vitest_1.expect)(inv[0].count).toBe(10); // Unmodified
    });
});

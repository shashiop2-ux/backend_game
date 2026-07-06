import { describe, it, expect } from 'vitest';
import { addToInventory, hasInInventory, removeFromInventory } from './inventory';
import { InventoryItem, ItemId } from 'shared';

describe('Inventory System', () => {
  const createEmptyInventory = (): InventoryItem[] => 
    Array.from({ length: 5 }, () => ({ itemId: ItemId.NONE, count: 0 }));

  it('should add items to empty slots', () => {
    const inv = createEmptyInventory();
    const success = addToInventory(inv, ItemId.WOOD, 10);
    
    expect(success).toBe(true);
    expect(inv[0].itemId).toBe(ItemId.WOOD);
    expect(inv[0].count).toBe(10);
  });

  it('should stack items of the same type', () => {
    const inv = createEmptyInventory();
    addToInventory(inv, ItemId.WOOD, 10);
    const success = addToInventory(inv, ItemId.WOOD, 15);
    
    expect(success).toBe(true);
    expect(inv[0].itemId).toBe(ItemId.WOOD);
    expect(inv[0].count).toBe(25);
    expect(inv[1].itemId).toBe(ItemId.NONE); // No new slot used
  });

  it('should split stacks when max stack is exceeded', () => {
    const inv = createEmptyInventory();
    // Wood maxStack is 64
    addToInventory(inv, ItemId.WOOD, 50);
    const success = addToInventory(inv, ItemId.WOOD, 20); // Total 70
    
    expect(success).toBe(true);
    expect(inv[0].itemId).toBe(ItemId.WOOD);
    expect(inv[0].count).toBe(64); // Filled first slot
    expect(inv[1].itemId).toBe(ItemId.WOOD);
    expect(inv[1].count).toBe(6);  // Remaining in second slot
  });

  it('should fail to add items if inventory is full', () => {
    const inv = createEmptyInventory();
    // Fill all 5 slots
    for (let i = 0; i < 5; i++) {
      inv[i] = { itemId: ItemId.STONE, count: 64 };
    }

    const success = addToInventory(inv, ItemId.WOOD, 5);
    expect(success).toBe(false);
  });

  it('should check if inventory has items', () => {
    const inv = createEmptyInventory();
    inv[0] = { itemId: ItemId.WOOD, count: 10 };
    inv[1] = { itemId: ItemId.WOOD, count: 5 };

    expect(hasInInventory(inv, ItemId.WOOD, 12)).toBe(true);
    expect(hasInInventory(inv, ItemId.WOOD, 16)).toBe(false);
    expect(hasInInventory(inv, ItemId.STONE, 1)).toBe(false);
  });

  it('should remove items correctly', () => {
    const inv = createEmptyInventory();
    inv[0] = { itemId: ItemId.WOOD, count: 10 };
    inv[1] = { itemId: ItemId.WOOD, count: 5 };

    const success = removeFromInventory(inv, ItemId.WOOD, 12);
    expect(success).toBe(true);
    // Remaining should be 3
    expect(inv[0].itemId).toBe(ItemId.NONE); // First slot emptied
    expect(inv[1].itemId).toBe(ItemId.WOOD);
    expect(inv[1].count).toBe(3);            // Second slot has the rest
  });

  it('should fail to remove items if not enough are present', () => {
    const inv = createEmptyInventory();
    inv[0] = { itemId: ItemId.WOOD, count: 10 };

    const success = removeFromInventory(inv, ItemId.WOOD, 12);
    expect(success).toBe(false);
    expect(inv[0].count).toBe(10); // Unmodified
  });
});

import { describe, it, expect } from 'vitest';
import { generateWorld } from './world';
import { TileType, WORLD_WIDTH, WORLD_HEIGHT } from 'shared';

describe('World Generator', () => {
  it('should generate a map of correct dimensions', () => {
    const map = generateWorld('test-seed-1');
    expect(map).toHaveLength(WORLD_WIDTH * WORLD_HEIGHT);
  });

  it('should have water boundaries on all four edges', () => {
    const map = generateWorld('test-seed-2');

    // Check top and bottom rows
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const topIdx = x;
      const bottomIdx = (WORLD_HEIGHT - 1) * WORLD_WIDTH + x;
      expect(map[topIdx]).toBe(TileType.WATER);
      expect(map[bottomIdx]).toBe(TileType.WATER);
    }

    // Check left and right columns
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      const leftIdx = y * WORLD_WIDTH;
      const rightIdx = y * WORLD_WIDTH + (WORLD_WIDTH - 1);
      expect(map[leftIdx]).toBe(TileType.WATER);
      expect(map[rightIdx]).toBe(TileType.WATER);
    }
  });

  it('should be deterministic for the same seed', () => {
    const seed = 'my-custom-deterministic-seed';
    const map1 = generateWorld(seed);
    const map2 = generateWorld(seed);

    expect(map1).toEqual(map2);
  });

  it('should generate different maps for different seeds', () => {
    const map1 = generateWorld('seed-a');
    const map2 = generateWorld('seed-b');

    expect(map1).not.toEqual(map2);
  });
});

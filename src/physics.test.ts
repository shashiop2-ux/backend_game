import { describe, it, expect } from 'vitest';
import { checkCollision } from './physics';
import { TileType, TILE_SIZE, WORLD_WIDTH } from 'shared';

describe('Collision System', () => {
  // Create a mock flat map (10x10) for testing
  const testWidth = 100; // Match WORLD_WIDTH
  const mockMap = new Array(testWidth * testWidth).fill(TileType.GRASS);
  
  // Set some solid blocks
  // Tile (2, 2) is Stone (solid)
  mockMap[2 * testWidth + 2] = TileType.STONE;
  // Tile (3, 3) is Water (solid)
  mockMap[3 * testWidth + 3] = TileType.WATER;
  // Tile (4, 4) is Tree (solid)
  mockMap[4 * testWidth + 4] = TileType.TREE;

  it('should not collide on a Grass tile', () => {
    // Center of tile (1, 1) -> (48, 48)
    const px = 1 * TILE_SIZE + 16;
    const py = 1 * TILE_SIZE + 16;
    expect(checkCollision(px, py, mockMap)).toBe(false);
  });

  it('should collide with a Stone block', () => {
    // Stone block is at (2, 2) which spans pixels (64 to 96) in X and Y
    // Checking a position that intersects tile (2, 2)
    const px = 2 * TILE_SIZE + 2; // X = 66
    const py = 2 * TILE_SIZE + 2; // Y = 66
    // Since player radius is 10, corner at (56, 56) is fine, but other corner at (76, 76) is inside (2, 2)
    expect(checkCollision(px, py, mockMap)).toBe(true);
  });

  it('should collide with Water', () => {
    const px = 3 * TILE_SIZE + 16;
    const py = 3 * TILE_SIZE + 16;
    expect(checkCollision(px, py, mockMap)).toBe(true);
  });

  it('should collide with a Tree', () => {
    const px = 4 * TILE_SIZE + 16;
    const py = 4 * TILE_SIZE + 16;
    expect(checkCollision(px, py, mockMap)).toBe(true);
  });

  it('should collide when out of bounds', () => {
    // Left boundary
    expect(checkCollision(-5, 50, mockMap)).toBe(true);
    // Right boundary
    expect(checkCollision(WORLD_WIDTH * TILE_SIZE + 5, 50, mockMap)).toBe(true);
    // Top boundary
    expect(checkCollision(50, -5, mockMap)).toBe(true);
  });
});

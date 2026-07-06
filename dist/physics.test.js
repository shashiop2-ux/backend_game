"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const physics_1 = require("./physics");
const shared_1 = require("shared");
(0, vitest_1.describe)('Collision System', () => {
    // Create a mock flat map (10x10) for testing
    const testWidth = 100; // Match WORLD_WIDTH
    const mockMap = new Array(testWidth * testWidth).fill(shared_1.TileType.GRASS);
    // Set some solid blocks
    // Tile (2, 2) is Stone (solid)
    mockMap[2 * testWidth + 2] = shared_1.TileType.STONE;
    // Tile (3, 3) is Water (solid)
    mockMap[3 * testWidth + 3] = shared_1.TileType.WATER;
    // Tile (4, 4) is Tree (solid)
    mockMap[4 * testWidth + 4] = shared_1.TileType.TREE;
    (0, vitest_1.it)('should not collide on a Grass tile', () => {
        // Center of tile (1, 1) -> (48, 48)
        const px = 1 * shared_1.TILE_SIZE + 16;
        const py = 1 * shared_1.TILE_SIZE + 16;
        (0, vitest_1.expect)((0, physics_1.checkCollision)(px, py, mockMap)).toBe(false);
    });
    (0, vitest_1.it)('should collide with a Stone block', () => {
        // Stone block is at (2, 2) which spans pixels (64 to 96) in X and Y
        // Checking a position that intersects tile (2, 2)
        const px = 2 * shared_1.TILE_SIZE + 2; // X = 66
        const py = 2 * shared_1.TILE_SIZE + 2; // Y = 66
        // Since player radius is 10, corner at (56, 56) is fine, but other corner at (76, 76) is inside (2, 2)
        (0, vitest_1.expect)((0, physics_1.checkCollision)(px, py, mockMap)).toBe(true);
    });
    (0, vitest_1.it)('should collide with Water', () => {
        const px = 3 * shared_1.TILE_SIZE + 16;
        const py = 3 * shared_1.TILE_SIZE + 16;
        (0, vitest_1.expect)((0, physics_1.checkCollision)(px, py, mockMap)).toBe(true);
    });
    (0, vitest_1.it)('should collide with a Tree', () => {
        const px = 4 * shared_1.TILE_SIZE + 16;
        const py = 4 * shared_1.TILE_SIZE + 16;
        (0, vitest_1.expect)((0, physics_1.checkCollision)(px, py, mockMap)).toBe(true);
    });
    (0, vitest_1.it)('should collide when out of bounds', () => {
        // Left boundary
        (0, vitest_1.expect)((0, physics_1.checkCollision)(-5, 50, mockMap)).toBe(true);
        // Right boundary
        (0, vitest_1.expect)((0, physics_1.checkCollision)(shared_1.WORLD_WIDTH * shared_1.TILE_SIZE + 5, 50, mockMap)).toBe(true);
        // Top boundary
        (0, vitest_1.expect)((0, physics_1.checkCollision)(50, -5, mockMap)).toBe(true);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const world_1 = require("./world");
const shared_1 = require("shared");
(0, vitest_1.describe)('World Generator', () => {
    (0, vitest_1.it)('should generate a map of correct dimensions', () => {
        const map = (0, world_1.generateWorld)('test-seed-1');
        (0, vitest_1.expect)(map).toHaveLength(shared_1.WORLD_WIDTH * shared_1.WORLD_HEIGHT);
    });
    (0, vitest_1.it)('should have water boundaries on all four edges', () => {
        const map = (0, world_1.generateWorld)('test-seed-2');
        // Check top and bottom rows
        for (let x = 0; x < shared_1.WORLD_WIDTH; x++) {
            const topIdx = x;
            const bottomIdx = (shared_1.WORLD_HEIGHT - 1) * shared_1.WORLD_WIDTH + x;
            (0, vitest_1.expect)(map[topIdx]).toBe(shared_1.TileType.WATER);
            (0, vitest_1.expect)(map[bottomIdx]).toBe(shared_1.TileType.WATER);
        }
        // Check left and right columns
        for (let y = 0; y < shared_1.WORLD_HEIGHT; y++) {
            const leftIdx = y * shared_1.WORLD_WIDTH;
            const rightIdx = y * shared_1.WORLD_WIDTH + (shared_1.WORLD_WIDTH - 1);
            (0, vitest_1.expect)(map[leftIdx]).toBe(shared_1.TileType.WATER);
            (0, vitest_1.expect)(map[rightIdx]).toBe(shared_1.TileType.WATER);
        }
    });
    (0, vitest_1.it)('should be deterministic for the same seed', () => {
        const seed = 'my-custom-deterministic-seed';
        const map1 = (0, world_1.generateWorld)(seed);
        const map2 = (0, world_1.generateWorld)(seed);
        (0, vitest_1.expect)(map1).toEqual(map2);
    });
    (0, vitest_1.it)('should generate different maps for different seeds', () => {
        const map1 = (0, world_1.generateWorld)('seed-a');
        const map2 = (0, world_1.generateWorld)('seed-b');
        (0, vitest_1.expect)(map1).not.toEqual(map2);
    });
});

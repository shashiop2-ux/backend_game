"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWorld = generateWorld;
const simplex_noise_1 = require("simplex-noise");
const shared_1 = require("shared");
// A simple deterministic PRNG based on a string seed
function pseudoRandom(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}
function generateWorld(seed) {
    const prng = pseudoRandom(seed);
    // createNoise2D can accept a custom PRNG function
    const noiseElevation = (0, simplex_noise_1.createNoise2D)(prng);
    const noiseResources = (0, simplex_noise_1.createNoise2D)(prng);
    const map = new Array(shared_1.WORLD_WIDTH * shared_1.WORLD_HEIGHT).fill(shared_1.TileType.EMPTY);
    for (let y = 0; y < shared_1.WORLD_HEIGHT; y++) {
        for (let x = 0; x < shared_1.WORLD_WIDTH; x++) {
            const idx = y * shared_1.WORLD_WIDTH + x;
            // Force border tiles to be water to clamp the world boundaries
            if (x === 0 || x === shared_1.WORLD_WIDTH - 1 || y === 0 || y === shared_1.WORLD_HEIGHT - 1) {
                map[idx] = shared_1.TileType.WATER;
                continue;
            }
            // Normalized coordinates for noise calculation
            const nx = x / 25;
            const ny = y / 25;
            // Elevation value between -1.0 and 1.0
            const elevation = noiseElevation(nx, ny);
            let baseTile = shared_1.TileType.GRASS;
            if (elevation < -0.3) {
                baseTile = shared_1.TileType.WATER;
            }
            else if (elevation < -0.15) {
                baseTile = shared_1.TileType.DIRT;
            }
            else if (elevation > 0.35) {
                baseTile = shared_1.TileType.STONE;
            }
            map[idx] = baseTile;
            // Overlay resources on solid ground (not water)
            if (baseTile !== shared_1.TileType.WATER) {
                // Frequency is higher for resource patches
                const rx = x / 8;
                const ry = y / 8;
                const resNoise = noiseResources(rx, ry);
                const chance = prng();
                if (baseTile === shared_1.TileType.STONE) {
                    // Stone areas spawn Rocks and Iron Ore nodes
                    if (resNoise > 0.25) {
                        if (chance < 0.25) {
                            map[idx] = shared_1.TileType.IRON_ORE_NODE;
                        }
                        else {
                            map[idx] = shared_1.TileType.ROCK;
                        }
                    }
                }
                else if (baseTile === shared_1.TileType.GRASS) {
                    // Grass areas spawn Trees
                    if (resNoise > 0.15 && chance < 0.4) {
                        map[idx] = shared_1.TileType.TREE;
                    }
                    else if (resNoise < -0.4 && chance < 0.2) {
                        map[idx] = shared_1.TileType.ROCK;
                    }
                }
            }
        }
    }
    return map;
}

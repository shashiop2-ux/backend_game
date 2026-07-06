import { createNoise2D } from 'simplex-noise';
import { TileType, WORLD_WIDTH, WORLD_HEIGHT } from 'shared';

// A simple deterministic PRNG based on a string seed
function pseudoRandom(seed: string) {
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

export function generateWorld(seed: string): TileType[] {
  const prng = pseudoRandom(seed);
  
  // createNoise2D can accept a custom PRNG function
  const noiseElevation = createNoise2D(prng);
  const noiseResources = createNoise2D(prng);

  const map: TileType[] = new Array(WORLD_WIDTH * WORLD_HEIGHT).fill(TileType.EMPTY);

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const idx = y * WORLD_WIDTH + x;

      // Force border tiles to be water to clamp the world boundaries
      if (x === 0 || x === WORLD_WIDTH - 1 || y === 0 || y === WORLD_HEIGHT - 1) {
        map[idx] = TileType.WATER;
        continue;
      }

      // Normalized coordinates for noise calculation
      const nx = x / 25;
      const ny = y / 25;

      // Elevation value between -1.0 and 1.0
      const elevation = noiseElevation(nx, ny);

      let baseTile = TileType.GRASS;
      if (elevation < -0.3) {
        baseTile = TileType.WATER;
      } else if (elevation < -0.15) {
        baseTile = TileType.DIRT;
      } else if (elevation > 0.35) {
        baseTile = TileType.STONE;
      }

      map[idx] = baseTile;

      // Overlay resources on solid ground (not water)
      if (baseTile !== TileType.WATER) {
        // Frequency is higher for resource patches
        const rx = x / 8;
        const ry = y / 8;
        const resNoise = noiseResources(rx, ry);
        const chance = prng();

        if (baseTile === TileType.STONE) {
          // Stone areas spawn Rocks and Iron Ore nodes
          if (resNoise > 0.25) {
            if (chance < 0.25) {
              map[idx] = TileType.IRON_ORE_NODE;
            } else {
              map[idx] = TileType.ROCK;
            }
          }
        } else if (baseTile === TileType.GRASS) {
          // Grass areas spawn Trees
          if (resNoise > 0.15 && chance < 0.4) {
            map[idx] = TileType.TREE;
          } else if (resNoise < -0.4 && chance < 0.2) {
            map[idx] = TileType.ROCK;
          }
        }
      }
    }
  }

  return map;
}
export type WorldMap = TileType[];

import { TileType, TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, TILE_METADATA } from 'shared';

/**
 * Checks if a circular/box bounding area at (x, y) collides with solid tiles in the world map.
 * @param x Player center X position in pixels
 * @param y Player center Y position in pixels
 * @param worldMap Flat array of tiles
 * @returns true if there is a collision, false otherwise
 */
export function checkCollision(x: number, y: number, worldMap: TileType[]): boolean {
  const radius = 10; // 20px bounding box
  const corners = [
    { x: x - radius, y: y - radius },
    { x: x + radius, y: y - radius },
    { x: x - radius, y: y + radius },
    { x: x + radius, y: y + radius },
  ];

  for (const corner of corners) {
    const tx = Math.floor(corner.x / TILE_SIZE);
    const ty = Math.floor(corner.y / TILE_SIZE);

    // Out of bounds is considered solid collision
    if (tx < 0 || tx >= WORLD_WIDTH || ty < 0 || ty >= WORLD_HEIGHT) {
      return true;
    }

    const idx = ty * WORLD_WIDTH + tx;
    const tileType = worldMap[idx];
    const meta = TILE_METADATA[tileType];

    if (meta && meta.isSolid) {
      return true;
    }
  }

  return false;
}

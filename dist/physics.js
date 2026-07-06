"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCollision = checkCollision;
const shared_1 = require("shared");
/**
 * Checks if a circular/box bounding area at (x, y) collides with solid tiles in the world map.
 * @param x Player center X position in pixels
 * @param y Player center Y position in pixels
 * @param worldMap Flat array of tiles
 * @returns true if there is a collision, false otherwise
 */
function checkCollision(x, y, worldMap) {
    const radius = 10; // 20px bounding box
    const corners = [
        { x: x - radius, y: y - radius },
        { x: x + radius, y: y - radius },
        { x: x - radius, y: y + radius },
        { x: x + radius, y: y + radius },
    ];
    for (const corner of corners) {
        const tx = Math.floor(corner.x / shared_1.TILE_SIZE);
        const ty = Math.floor(corner.y / shared_1.TILE_SIZE);
        // Out of bounds is considered solid collision
        if (tx < 0 || tx >= shared_1.WORLD_WIDTH || ty < 0 || ty >= shared_1.WORLD_HEIGHT) {
            return true;
        }
        const idx = ty * shared_1.WORLD_WIDTH + tx;
        const tileType = worldMap[idx];
        const meta = shared_1.TILE_METADATA[tileType];
        if (meta && meta.isSolid) {
            return true;
        }
    }
    return false;
}

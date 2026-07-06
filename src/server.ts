import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { generateWorld } from './world';
import { checkCollision } from './physics';
import {
  TileType,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  TILE_SIZE,
  ClientMessageType,
  ClientMessage,
  ServerMessageType,
  ServerMessage,
  PlayerState,
  MobState,
  TileUpdate,
  ItemId,
  DAY_DURATION_MS,
  TILE_METADATA,
  ITEM_METADATA,
} from 'shared';
import { addToInventory, removeFromInventory, hasInInventory } from './inventory';

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Game Sessions mapped by Discord instanceId
interface GameSession {
  instanceId: string;
  worldMap: TileType[];
  players: Record<string, PlayerState>;
  mobs: MobState[];
  dirtyTiles: TileUpdate[];
  lastProcessedSeqs: Record<string, number>;
  clients: Map<string, WebSocket>; // userId -> WebSocket
  tileHealth: Record<string, number>; // key: "x,y", value: health remaining
}

const sessions: Record<string, GameSession> = {};

// Helper: find a safe spawn position (a grass tile near the center if possible)
function findSpawnPosition(worldMap: TileType[]): { x: number; y: number } {
  const centerCol = Math.floor(WORLD_WIDTH / 2);
  const centerRow = Math.floor(WORLD_HEIGHT / 2);

  // Spiral outwards from the center to find a grass tile
  for (let r = 0; r < 20; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const tx = centerCol + dx;
        const ty = centerRow + dy;
        if (tx > 0 && tx < WORLD_WIDTH - 1 && ty > 0 && ty < WORLD_HEIGHT - 1) {
          const idx = ty * WORLD_WIDTH + tx;
          if (worldMap[idx] === TileType.GRASS) {
            return {
              x: tx * TILE_SIZE + TILE_SIZE / 2,
              y: ty * TILE_SIZE + TILE_SIZE / 2,
            };
          }
        }
      }
    }
  }

  // Fallback
  return { x: 50 * TILE_SIZE + 16, y: 50 * TILE_SIZE + 16 };
}

// Get or create session
function getOrCreateSession(instanceId: string): GameSession {
  if (!sessions[instanceId]) {
    console.log(`Generating new world for instance ${instanceId}...`);
    const worldMap = generateWorld(instanceId);
    sessions[instanceId] = {
      instanceId,
      worldMap,
      players: {},
      mobs: [],
      dirtyTiles: [],
      lastProcessedSeqs: {},
      clients: new Map(),
      tileHealth: {},
    };
  }
  return sessions[instanceId];
}

// Serve static assets from /client/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for Vite client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// HTTP Upgrade handler for WebSocket connection
httpServer.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const params = url.searchParams;
  const instanceId = params.get('instanceId');
  const userId = params.get('userId');

  if (!instanceId || !userId) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws: WebSocket, request) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const params = url.searchParams;
  const instanceId = params.get('instanceId')!;
  const userId = params.get('userId')!;
  const username = params.get('username') || `Player_${userId.slice(-4)}`;
  const avatar = params.get('avatar') || '';

  console.log(`Player ${username} (${userId}) connected to session ${instanceId}`);

  const session = getOrCreateSession(instanceId);

  // If player already exists, reclaim. Otherwise, create new
  let player = session.players[userId];
  if (!player) {
    const spawn = findSpawnPosition(session.worldMap);
    player = {
      id: userId,
      username,
      avatar,
      x: spawn.x,
      y: spawn.y,
      health: 100,
      hunger: 100,
      activeItem: ItemId.NONE,
      inventory: Array.from({ length: 20 }, () => ({ itemId: ItemId.NONE, count: 0 })),
    };
    
    // Give some starting items for testing
    player.inventory[0] = { itemId: ItemId.APPLE, count: 5 };
    player.inventory[1] = { itemId: ItemId.WOOD, count: 10 };
    player.inventory[2] = { itemId: ItemId.STONE, count: 5 };
  }

  session.players[userId] = player;
  session.clients.set(userId, ws);

  // Send INIT message to client
  const initMsg: ServerMessage = {
    type: ServerMessageType.INIT,
    playerId: userId,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    worldMap: session.worldMap,
    playerState: player,
  };
  ws.send(JSON.stringify(initMsg));

  // Listen for client messages
  ws.on('message', (data) => {
    try {
      const msg: ClientMessage = JSON.parse(data.toString());
      handleClientMessage(session, userId, msg);
    } catch (e) {
      console.error(`Error parsing client message from ${userId}:`, e);
    }
  });

  // Handle disconnect
  ws.on('close', () => {
    console.log(`Player ${username} disconnected from session ${instanceId}`);
    session.clients.delete(userId);
    
    // Broadcast player left
    const leaveMsg: ServerMessage = {
      type: ServerMessageType.PLAYER_LEFT,
      playerId: userId,
    };
    broadcastToSession(session, leaveMsg);

    // If session is empty, we can clean up (saving done in Phase 6)
    if (session.clients.size === 0) {
      // Save data, then optionally clear session to free memory
      console.log(`Session ${instanceId} is now empty.`);
    }
  });
});

function handleClientMessage(session: GameSession, userId: string, msg: ClientMessage) {
  const player = session.players[userId];
  if (!player) return;

  switch (msg.type) {
    case ClientMessageType.MOVE: {
      const newX = msg.x;
      const newY = msg.y;

      const dx = newX - player.x;
      const dy = newY - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 40) {
        if (!checkCollision(newX, newY, session.worldMap)) {
          player.x = newX;
          player.y = newY;
        }
      }
      
      session.lastProcessedSeqs[userId] = msg.seq;
      break;
    }
    case ClientMessageType.MINE: {
      const tx = msg.x;
      const ty = msg.y;

      // Validate range: Player center to tile center distance
      const tileCenterX = tx * TILE_SIZE + TILE_SIZE / 2;
      const tileCenterY = ty * TILE_SIZE + TILE_SIZE / 2;
      const dx = tileCenterX - player.x;
      const dy = tileCenterY - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Interaction range limit: 140px (approx. 4.3 tiles)
      if (dist > 140) {
        console.log(`Player ${player.username} attempted to mine out of range: ${dist.toFixed(1)}px`);
        break;
      }

      // Check bounds
      if (tx < 0 || tx >= WORLD_WIDTH || ty < 0 || ty >= WORLD_HEIGHT) break;

      const idx = ty * WORLD_WIDTH + tx;
      const tileType = session.worldMap[idx];
      const meta = TILE_METADATA[tileType];

      if (!meta || meta.durability <= 0) {
        // Not breakable
        break;
      }

      // Apply damage from player tool
      let damage = 1;
      const activeItemMeta = ITEM_METADATA[player.activeItem];
      if (activeItemMeta && activeItemMeta.miningPower) {
        damage = activeItemMeta.miningPower;
      }

      const key = `${tx},${ty}`;
      let health = session.tileHealth[key] !== undefined ? session.tileHealth[key] : meta.durability;
      health -= damage;

      if (health <= 0) {
        // Break the tile
        delete session.tileHealth[key];

        // Determine base replacement tile
        let replacement = TileType.EMPTY;
        if (tileType === TileType.TREE) {
          replacement = TileType.GRASS;
        } else if (tileType === TileType.ROCK) {
          replacement = TileType.GRASS;
        } else if (tileType === TileType.IRON_ORE_NODE) {
          replacement = TileType.STONE;
        }

        session.worldMap[idx] = replacement;
        session.dirtyTiles.push({ x: tx, y: ty, type: replacement });

        // Award resource
        if (meta.yieldItem !== ItemId.NONE && meta.yieldCount > 0) {
          const added = addToInventory(player.inventory, meta.yieldItem, meta.yieldCount);
          if (added) {
            // Send inventory update to this client only
            const ws = session.clients.get(userId);
            if (ws && ws.readyState === WebSocket.OPEN) {
              const invMsg: ServerMessage = {
                type: ServerMessageType.INVENTORY_UPDATE,
                inventory: player.inventory,
              };
              ws.send(JSON.stringify(invMsg));
            }
          }
        }
      } else {
        session.tileHealth[key] = health;
      }
      break;
    }

    case ClientMessageType.PLACE: {
      const tx = msg.x;
      const ty = msg.y;
      const itemId = msg.itemId;

      // Validate range
      const tileCenterX = tx * TILE_SIZE + TILE_SIZE / 2;
      const tileCenterY = ty * TILE_SIZE + TILE_SIZE / 2;
      const dx = tileCenterX - player.x;
      const dy = tileCenterY - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 140) break;

      // Check bounds
      if (tx < 0 || tx >= WORLD_WIDTH || ty < 0 || ty >= WORLD_HEIGHT) break;

      const idx = ty * WORLD_WIDTH + tx;
      const currentTile = session.worldMap[idx];

      // Placing is only allowed on empty tile space
      if (currentTile !== TileType.EMPTY) break;

      // Verify player inventory owns this item
      if (!hasInInventory(player.inventory, itemId, 1)) break;

      const itemMeta = ITEM_METADATA[itemId];
      if (!itemMeta || !itemMeta.isPlaceable || itemMeta.placesTile === undefined) break;

      // Check if any player resides on the target tile to prevent trapping/suffocation
      let isOccupied = false;
      const tileLeft = tx * TILE_SIZE;
      const tileRight = (tx + 1) * TILE_SIZE;
      const tileTop = ty * TILE_SIZE;
      const tileBottom = (ty + 1) * TILE_SIZE;

      for (const pId in session.players) {
        const p = session.players[pId];
        const pLeft = p.x - 10;
        const pRight = p.x + 10;
        const pTop = p.y - 10;
        const pBottom = p.y + 10;

        // Intersection check
        if (pLeft < tileRight && pRight > tileLeft && pTop < tileBottom && pBottom > tileTop) {
          isOccupied = true;
          break;
        }
      }

      if (isOccupied) break;

      // Place block!
      const success = removeFromInventory(player.inventory, itemId, 1);
      if (success) {
        const placedTile = itemMeta.placesTile;
        session.worldMap[idx] = placedTile;
        session.dirtyTiles.push({ x: tx, y: ty, type: placedTile });

        // Sync inventory back
        const ws = session.clients.get(userId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          const invMsg: ServerMessage = {
            type: ServerMessageType.INVENTORY_UPDATE,
            inventory: player.inventory,
          };
          ws.send(JSON.stringify(invMsg));
        }
      }
      break;
    }

    case ClientMessageType.SELECT_ITEM: {
      const itemId = msg.itemId;
      if (itemId === ItemId.NONE || hasInInventory(player.inventory, itemId, 1)) {
        player.activeItem = itemId;
      }
      break;
    }

    default:
      break;
  }
}

function broadcastToSession(session: GameSession, msg: ServerMessage) {
  const payload = JSON.stringify(msg);
  session.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

// Autoritative Game Server Tick Loop (20Hz)
const TICK_RATE = 20; // 20 times per second
const TICK_INTERVAL = 1000 / TICK_RATE;

setInterval(() => {
  for (const instanceId in sessions) {
    const session = sessions[instanceId];
    if (session.clients.size === 0) continue;

    // Day/Night Cycle Tick (just incrementing relative time)
    // 10 minutes = 600,000 ms.
    const now = Date.now();
    const timeOfDay = (now % DAY_DURATION_MS) / DAY_DURATION_MS;

    // Send tick updates
    const tickMsg: ServerMessage = {
      type: ServerMessageType.TICK,
      timeOfDay,
      players: session.players,
      mobs: session.mobs,
      lastProcessedSeq: session.lastProcessedSeqs,
    };
    broadcastToSession(session, tickMsg);

    // If there are dirty tile updates, broadcast them and clear queue
    if (session.dirtyTiles.length > 0) {
      const tileUpdateMsg: ServerMessage = {
        type: ServerMessageType.TILE_UPDATE,
        updates: session.dirtyTiles,
      };
      broadcastToSession(session, tileUpdateMsg);
      session.dirtyTiles = [];
    }
  }
}, TICK_INTERVAL);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

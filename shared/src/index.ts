// World Configuration
export const TILE_SIZE = 32; // Pixels
export const WORLD_WIDTH = 100; // Tiles
export const WORLD_HEIGHT = 100; // Tiles
export const VIEW_DISTANCE = 15; // Chunk/tile rendering radius around player

// Day/Night Configuration
export const DAY_DURATION_MS = 600000; // 10 minutes per day

// Tile Types
export enum TileType {
  EMPTY = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  WATER = 4,
  TREE = 5,
  ROCK = 6,
  IRON_ORE_NODE = 7,
}

// Tile Details Metadata
export interface TileMetadata {
  type: TileType;
  name: string;
  isSolid: boolean;
  durability: number; // Hits required to break (null if unbreakable)
  yieldItem: number; // Item ID yielded
  yieldCount: number;
}

export const TILE_METADATA: Record<TileType, TileMetadata> = {
  [TileType.EMPTY]: { type: TileType.EMPTY, name: 'Air', isSolid: false, durability: 0, yieldItem: 0, yieldCount: 0 },
  [TileType.GRASS]: { type: TileType.GRASS, name: 'Grass', isSolid: false, durability: 3, yieldItem: 10, yieldCount: 1 }, // Yields Grass Block
  [TileType.DIRT]: { type: TileType.DIRT, name: 'Dirt', isSolid: false, durability: 3, yieldItem: 11, yieldCount: 1 }, // Yields Dirt Block
  [TileType.STONE]: { type: TileType.STONE, name: 'Stone', isSolid: true, durability: 5, yieldItem: 12, yieldCount: 1 }, // Yields Stone Block
  [TileType.WATER]: { type: TileType.WATER, name: 'Water', isSolid: true, durability: 0, yieldItem: 0, yieldCount: 0 }, // Unbreakable
  [TileType.TREE]: { type: TileType.TREE, name: 'Tree', isSolid: true, durability: 4, yieldItem: 1, yieldCount: 3 }, // Yields Wood
  [TileType.ROCK]: { type: TileType.ROCK, name: 'Rock', isSolid: true, durability: 5, yieldItem: 2, yieldCount: 2 }, // Yields Stone Item
  [TileType.IRON_ORE_NODE]: { type: TileType.IRON_ORE_NODE, name: 'Iron Ore', isSolid: true, durability: 7, yieldItem: 3, yieldCount: 1 }, // Yields Iron Ore Item
};

// Item Types
export enum ItemId {
  NONE = 0,
  WOOD = 1,
  STONE = 2,
  IRON_ORE = 3,
  IRON_INGOT = 4,
  APPLE = 5,      // Restores 20 Hunger
  COOKED_MEAT = 6, // Restores 40 Hunger, 10 Health
  WOODEN_PICKAXE = 7, // Mining power 1.5x
  STONE_PICKAXE = 8,  // Mining power 2x
  IRON_PICKAXE = 9,   // Mining power 3x
  GRASS_BLOCK = 10,
  DIRT_BLOCK = 11,
  STONE_BLOCK = 12,
  RAW_MEAT = 13,
}

export interface ItemMetadata {
  id: ItemId;
  name: string;
  maxStack: number;
  isPlaceable: boolean;
  placesTile?: TileType;
  isEdible: boolean;
  hungerRestore?: number;
  healthRestore?: number;
  miningPower?: number; // multiplier for tile damage
}

export const ITEM_METADATA: Record<ItemId, ItemMetadata> = {
  [ItemId.NONE]: { id: ItemId.NONE, name: 'Empty', maxStack: 0, isPlaceable: false, isEdible: false },
  [ItemId.WOOD]: { id: ItemId.WOOD, name: 'Wood', maxStack: 64, isPlaceable: false, isEdible: false },
  [ItemId.STONE]: { id: ItemId.STONE, name: 'Stone', maxStack: 64, isPlaceable: false, isEdible: false },
  [ItemId.IRON_ORE]: { id: ItemId.IRON_ORE, name: 'Iron Ore', maxStack: 64, isPlaceable: false, isEdible: false },
  [ItemId.IRON_INGOT]: { id: ItemId.IRON_INGOT, name: 'Iron Ingot', maxStack: 64, isPlaceable: false, isEdible: false },
  [ItemId.APPLE]: { id: ItemId.APPLE, name: 'Apple', maxStack: 64, isPlaceable: false, isEdible: true, hungerRestore: 20, healthRestore: 5 },
  [ItemId.COOKED_MEAT]: { id: ItemId.COOKED_MEAT, name: 'Cooked Meat', maxStack: 64, isPlaceable: false, isEdible: true, hungerRestore: 45, healthRestore: 20 },
  [ItemId.RAW_MEAT]: { id: ItemId.RAW_MEAT, name: 'Raw Meat', maxStack: 64, isPlaceable: false, isEdible: true, hungerRestore: 10, healthRestore: -5 },
  [ItemId.WOODEN_PICKAXE]: { id: ItemId.WOODEN_PICKAXE, name: 'Wooden Pickaxe', maxStack: 1, isPlaceable: false, isEdible: false, miningPower: 1.5 },
  [ItemId.STONE_PICKAXE]: { id: ItemId.STONE_PICKAXE, name: 'Stone Pickaxe', maxStack: 1, isPlaceable: false, isEdible: false, miningPower: 2.0 },
  [ItemId.IRON_PICKAXE]: { id: ItemId.IRON_PICKAXE, name: 'Iron Pickaxe', maxStack: 1, isPlaceable: false, isEdible: false, miningPower: 3.5 },
  [ItemId.GRASS_BLOCK]: { id: ItemId.GRASS_BLOCK, name: 'Grass Block', maxStack: 64, isPlaceable: true, placesTile: TileType.GRASS, isEdible: false },
  [ItemId.DIRT_BLOCK]: { id: ItemId.DIRT_BLOCK, name: 'Dirt Block', maxStack: 64, isPlaceable: true, placesTile: TileType.DIRT, isEdible: false },
  [ItemId.STONE_BLOCK]: { id: ItemId.STONE_BLOCK, name: 'Stone Block', maxStack: 64, isPlaceable: true, placesTile: TileType.STONE, isEdible: false },
};

// Crafting Recipe Interface
export interface Recipe {
  id: string;
  name: string;
  inputs: { itemId: ItemId; qty: number }[];
  output: { itemId: ItemId; qty: number };
}

export const CRAFTING_RECIPES: Recipe[] = [
  {
    id: 'wooden_pickaxe',
    name: 'Wooden Pickaxe',
    inputs: [{ itemId: ItemId.WOOD, qty: 10 }],
    output: { itemId: ItemId.WOODEN_PICKAXE, qty: 1 },
  },
  {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    inputs: [
      { itemId: ItemId.WOOD, qty: 5 },
      { itemId: ItemId.STONE, qty: 15 },
    ],
    output: { itemId: ItemId.STONE_PICKAXE, qty: 1 },
  },
  {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    inputs: [
      { itemId: ItemId.WOOD, qty: 5 },
      { itemId: ItemId.IRON_INGOT, qty: 10 },
    ],
    output: { itemId: ItemId.IRON_PICKAXE, qty: 1 },
  },
  {
    id: 'iron_ingot',
    name: 'Smelt Iron Ingot',
    inputs: [
      { itemId: ItemId.IRON_ORE, qty: 3 },
      { itemId: ItemId.WOOD, qty: 2 }, // Coal/Wood as fuel
    ],
    output: { itemId: ItemId.IRON_INGOT, qty: 1 },
  },
  {
    id: 'cooked_meat',
    name: 'Cook Meat',
    inputs: [
      { itemId: ItemId.RAW_MEAT, qty: 1 },
      { itemId: ItemId.WOOD, qty: 1 },
    ],
    output: { itemId: ItemId.COOKED_MEAT, qty: 1 },
  },
];

// Entity & Player Types
export interface InventoryItem {
  itemId: ItemId;
  count: number;
}

export interface PlayerState {
  id: string; // Discord user ID
  username: string;
  avatar: string;
  x: number; // Pixels
  y: number; // Pixels
  health: number;
  hunger: number;
  activeItem: ItemId; // Selected slot item
  inventory: InventoryItem[]; // Fixed 20 slots
}

export interface MobState {
  id: string;
  type: 'zombie' | 'slime';
  x: number;
  y: number;
  health: number;
  targetPlayerId: string | null;
}

// World state diff
export interface TileUpdate {
  x: number;
  y: number;
  type: TileType;
}

// Message types
export enum ClientMessageType {
  JOIN = 'C_JOIN',
  MOVE = 'C_MOVE',
  MINE = 'C_MINE',
  PLACE = 'C_PLACE',
  CRAFT = 'C_CRAFT',
  EAT = 'C_EAT',
  SELECT_ITEM = 'C_SELECT_ITEM',
}

export enum ServerMessageType {
  INIT = 'S_INIT',
  TICK = 'S_TICK',
  TILE_UPDATE = 'S_TILE_UPDATE',
  INVENTORY_UPDATE = 'S_INVENTORY_UPDATE',
  PLAYER_LEFT = 'S_PLAYER_LEFT',
}

// Client message payloads
export interface ClientMsgJoin {
  type: ClientMessageType.JOIN;
  username: string;
  avatar: string;
}

export interface ClientMsgMove {
  type: ClientMessageType.MOVE;
  x: number;
  y: number;
  seq: number; // Sequence number for reconciliation
}

export interface ClientMsgMine {
  type: ClientMessageType.MINE;
  x: number; // Tile x
  y: number; // Tile y
}

export interface ClientMsgPlace {
  type: ClientMessageType.PLACE;
  x: number; // Tile x
  y: number; // Tile y
  itemId: ItemId;
}

export interface ClientMsgCraft {
  type: ClientMessageType.CRAFT;
  recipeId: string;
}

export interface ClientMsgEat {
  type: ClientMessageType.EAT;
  slotIndex: number;
}

export interface ClientMsgSelectItem {
  type: ClientMessageType.SELECT_ITEM;
  itemId: ItemId;
}

export type ClientMessage =
  | ClientMsgJoin
  | ClientMsgMove
  | ClientMsgMine
  | ClientMsgPlace
  | ClientMsgCraft
  | ClientMsgEat
  | ClientMsgSelectItem;

// Server message payloads
export interface ServerMsgInit {
  type: ServerMessageType.INIT;
  playerId: string;
  worldWidth: number;
  worldHeight: number;
  worldMap: TileType[]; // Row-major flat array of tiles
  playerState: PlayerState;
}

export interface ServerMsgTick {
  type: ServerMessageType.TICK;
  timeOfDay: number; // 0.0 to 1.0
  players: Record<string, PlayerState>;
  mobs: MobState[];
  lastProcessedSeq: Record<string, number>; // Maps playerId to last processed move seq
}

export interface ServerMsgTileUpdate {
  type: ServerMessageType.TILE_UPDATE;
  updates: TileUpdate[];
}

export interface ServerMsgInventoryUpdate {
  type: ServerMessageType.INVENTORY_UPDATE;
  inventory: InventoryItem[];
}

export interface ServerMsgPlayerLeft {
  type: ServerMessageType.PLAYER_LEFT;
  playerId: string;
}

export type ServerMessage =
  | ServerMsgInit
  | ServerMsgTick
  | ServerMsgTileUpdate
  | ServerMsgInventoryUpdate
  | ServerMsgPlayerLeft;

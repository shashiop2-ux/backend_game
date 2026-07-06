export declare const TILE_SIZE = 32;
export declare const WORLD_WIDTH = 100;
export declare const WORLD_HEIGHT = 100;
export declare const VIEW_DISTANCE = 15;
export declare const DAY_DURATION_MS = 600000;
export declare enum TileType {
    EMPTY = 0,
    GRASS = 1,
    DIRT = 2,
    STONE = 3,
    WATER = 4,
    TREE = 5,
    ROCK = 6,
    IRON_ORE_NODE = 7
}
export interface TileMetadata {
    type: TileType;
    name: string;
    isSolid: boolean;
    durability: number;
    yieldItem: number;
    yieldCount: number;
}
export declare const TILE_METADATA: Record<TileType, TileMetadata>;
export declare enum ItemId {
    NONE = 0,
    WOOD = 1,
    STONE = 2,
    IRON_ORE = 3,
    IRON_INGOT = 4,
    APPLE = 5,// Restores 20 Hunger
    COOKED_MEAT = 6,// Restores 40 Hunger, 10 Health
    WOODEN_PICKAXE = 7,// Mining power 1.5x
    STONE_PICKAXE = 8,// Mining power 2x
    IRON_PICKAXE = 9,// Mining power 3x
    GRASS_BLOCK = 10,
    DIRT_BLOCK = 11,
    STONE_BLOCK = 12,
    RAW_MEAT = 13
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
    miningPower?: number;
}
export declare const ITEM_METADATA: Record<ItemId, ItemMetadata>;
export interface Recipe {
    id: string;
    name: string;
    inputs: {
        itemId: ItemId;
        qty: number;
    }[];
    output: {
        itemId: ItemId;
        qty: number;
    };
}
export declare const CRAFTING_RECIPES: Recipe[];
export interface InventoryItem {
    itemId: ItemId;
    count: number;
}
export interface PlayerState {
    id: string;
    username: string;
    avatar: string;
    x: number;
    y: number;
    health: number;
    hunger: number;
    activeItem: ItemId;
    inventory: InventoryItem[];
}
export interface MobState {
    id: string;
    type: 'zombie' | 'slime';
    x: number;
    y: number;
    health: number;
    targetPlayerId: string | null;
}
export interface TileUpdate {
    x: number;
    y: number;
    type: TileType;
}
export declare enum ClientMessageType {
    JOIN = "C_JOIN",
    MOVE = "C_MOVE",
    MINE = "C_MINE",
    PLACE = "C_PLACE",
    CRAFT = "C_CRAFT",
    EAT = "C_EAT",
    SELECT_ITEM = "C_SELECT_ITEM"
}
export declare enum ServerMessageType {
    INIT = "S_INIT",
    TICK = "S_TICK",
    TILE_UPDATE = "S_TILE_UPDATE",
    INVENTORY_UPDATE = "S_INVENTORY_UPDATE",
    PLAYER_LEFT = "S_PLAYER_LEFT"
}
export interface ClientMsgJoin {
    type: ClientMessageType.JOIN;
    username: string;
    avatar: string;
}
export interface ClientMsgMove {
    type: ClientMessageType.MOVE;
    x: number;
    y: number;
    seq: number;
}
export interface ClientMsgMine {
    type: ClientMessageType.MINE;
    x: number;
    y: number;
}
export interface ClientMsgPlace {
    type: ClientMessageType.PLACE;
    x: number;
    y: number;
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
export type ClientMessage = ClientMsgJoin | ClientMsgMove | ClientMsgMine | ClientMsgPlace | ClientMsgCraft | ClientMsgEat | ClientMsgSelectItem;
export interface ServerMsgInit {
    type: ServerMessageType.INIT;
    playerId: string;
    worldWidth: number;
    worldHeight: number;
    worldMap: TileType[];
    playerState: PlayerState;
}
export interface ServerMsgTick {
    type: ServerMessageType.TICK;
    timeOfDay: number;
    players: Record<string, PlayerState>;
    mobs: MobState[];
    lastProcessedSeq: Record<string, number>;
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
export type ServerMessage = ServerMsgInit | ServerMsgTick | ServerMsgTileUpdate | ServerMsgInventoryUpdate | ServerMsgPlayerLeft;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMessageType = exports.ClientMessageType = exports.CRAFTING_RECIPES = exports.ITEM_METADATA = exports.ItemId = exports.TILE_METADATA = exports.TileType = exports.DAY_DURATION_MS = exports.VIEW_DISTANCE = exports.WORLD_HEIGHT = exports.WORLD_WIDTH = exports.TILE_SIZE = void 0;
// World Configuration
exports.TILE_SIZE = 32; // Pixels
exports.WORLD_WIDTH = 100; // Tiles
exports.WORLD_HEIGHT = 100; // Tiles
exports.VIEW_DISTANCE = 15; // Chunk/tile rendering radius around player
// Day/Night Configuration
exports.DAY_DURATION_MS = 600000; // 10 minutes per day
// Tile Types
var TileType;
(function (TileType) {
    TileType[TileType["EMPTY"] = 0] = "EMPTY";
    TileType[TileType["GRASS"] = 1] = "GRASS";
    TileType[TileType["DIRT"] = 2] = "DIRT";
    TileType[TileType["STONE"] = 3] = "STONE";
    TileType[TileType["WATER"] = 4] = "WATER";
    TileType[TileType["TREE"] = 5] = "TREE";
    TileType[TileType["ROCK"] = 6] = "ROCK";
    TileType[TileType["IRON_ORE_NODE"] = 7] = "IRON_ORE_NODE";
})(TileType || (exports.TileType = TileType = {}));
exports.TILE_METADATA = {
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
var ItemId;
(function (ItemId) {
    ItemId[ItemId["NONE"] = 0] = "NONE";
    ItemId[ItemId["WOOD"] = 1] = "WOOD";
    ItemId[ItemId["STONE"] = 2] = "STONE";
    ItemId[ItemId["IRON_ORE"] = 3] = "IRON_ORE";
    ItemId[ItemId["IRON_INGOT"] = 4] = "IRON_INGOT";
    ItemId[ItemId["APPLE"] = 5] = "APPLE";
    ItemId[ItemId["COOKED_MEAT"] = 6] = "COOKED_MEAT";
    ItemId[ItemId["WOODEN_PICKAXE"] = 7] = "WOODEN_PICKAXE";
    ItemId[ItemId["STONE_PICKAXE"] = 8] = "STONE_PICKAXE";
    ItemId[ItemId["IRON_PICKAXE"] = 9] = "IRON_PICKAXE";
    ItemId[ItemId["GRASS_BLOCK"] = 10] = "GRASS_BLOCK";
    ItemId[ItemId["DIRT_BLOCK"] = 11] = "DIRT_BLOCK";
    ItemId[ItemId["STONE_BLOCK"] = 12] = "STONE_BLOCK";
    ItemId[ItemId["RAW_MEAT"] = 13] = "RAW_MEAT";
})(ItemId || (exports.ItemId = ItemId = {}));
exports.ITEM_METADATA = {
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
exports.CRAFTING_RECIPES = [
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
// Message types
var ClientMessageType;
(function (ClientMessageType) {
    ClientMessageType["JOIN"] = "C_JOIN";
    ClientMessageType["MOVE"] = "C_MOVE";
    ClientMessageType["MINE"] = "C_MINE";
    ClientMessageType["PLACE"] = "C_PLACE";
    ClientMessageType["CRAFT"] = "C_CRAFT";
    ClientMessageType["EAT"] = "C_EAT";
    ClientMessageType["SELECT_ITEM"] = "C_SELECT_ITEM";
})(ClientMessageType || (exports.ClientMessageType = ClientMessageType = {}));
var ServerMessageType;
(function (ServerMessageType) {
    ServerMessageType["INIT"] = "S_INIT";
    ServerMessageType["TICK"] = "S_TICK";
    ServerMessageType["TILE_UPDATE"] = "S_TILE_UPDATE";
    ServerMessageType["INVENTORY_UPDATE"] = "S_INVENTORY_UPDATE";
    ServerMessageType["PLAYER_LEFT"] = "S_PLAYER_LEFT";
})(ServerMessageType || (exports.ServerMessageType = ServerMessageType = {}));

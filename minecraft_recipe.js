// Recipe Parser Class (JavaScript port of Python RecipeParser)
class RecipeParser {
    constructor(content) {
        this.lines = content.trim().split('\n').map(line => line.replace(/\r$/, ''));
        this.resultIdentifier = null;
        this.pattern = [];
        this.substitutions = {};
        this.count = null;
    }

    parse() {
        if (this.lines.length < 5) {
            throw new Error(`Recipe file must have at least 5 lines (found ${this.lines.length})`);
        }

        // Line 1: result identifier
        this.resultIdentifier = this.lines[0].trim();
        if (!this.isValidIdentifier(this.resultIdentifier)) {
            throw new Error(`Invalid result identifier: ${this.resultIdentifier}`);
        }

        // Lines 2-4: pattern
        this.pattern = this.lines.slice(1, 4);
        for (let i = 0; i < this.pattern.length; i++) {
            if (this.pattern[i].length !== 3) {
                throw new Error(`Line ${i + 2} pattern must be exactly 3 characters (found ${this.pattern[i].length})`);
            }
        }

        // Parse substitutions and count
        this.parseSubstitutionsAndCount();

        // Validate all pattern symbols have substitutions
        this.validatePatternSymbols();
    }

    parseSubstitutionsAndCount() {
        const substitutionLines = this.lines.slice(4);

        if (substitutionLines.length === 0) {
            throw new Error('Missing substitution lines and count');
        }

        // Last line should be count
        const lastLine = substitutionLines[substitutionLines.length - 1].trim();
        this.count = parseInt(lastLine, 10);
        if (isNaN(this.count) || this.count <= 0) {
            throw new Error(`Last line must be a valid positive integer count: ${lastLine}`);
        }

        // Parse substitutions
        for (let i = 0; i < substitutionLines.length - 1; i++) {
            const line = substitutionLines[i].trim();
            if (!line) continue;

            const parts = line.split('=');
            if (parts.length !== 2) {
                throw new Error(`Line ${i + 5}: Invalid substitution format (expected 'SYMBOL = namespace:item')`);
            }

            const symbol = parts[0].trim();
            const item = parts[1].trim();

            if (symbol.length !== 1) {
                throw new Error(`Line ${i + 5}: Symbol must be a single character (found '${symbol}')`);
            }

            if (!this.isValidIdentifier(item)) {
                throw new Error(`Line ${i + 5}: Invalid item identifier: ${item}`);
            }

            if (this.substitutions.hasOwnProperty(symbol)) {
                throw new Error(`Line ${i + 5}: Duplicate symbol '${symbol}'`);
            }

            this.substitutions[symbol] = item;
        }
    }

    validatePatternSymbols() {
        const patternSymbols = new Set();
        for (const line of this.pattern) {
            for (const char of line) {
                if (char !== '-') {
                    patternSymbols.add(char);
                }
            }
        }

        const missing = [];
        for (const symbol of patternSymbols) {
            if (!this.substitutions.hasOwnProperty(symbol)) {
                missing.push(symbol);
            }
        }

        if (missing.length > 0) {
            throw new Error(`Pattern symbols without substitutions: ${missing.sort().join(', ')}`);
        }
    }

    isValidIdentifier(identifier) {
        if (!identifier.includes(':')) return false;
        const parts = identifier.split(':');
        return parts.length === 2 && parts[0].trim() && parts[1].trim();
    }

    toJson() {
        // Convert pattern, replacing '-' with space
        const jsonPattern = this.pattern.map(line => line.replace(/-/g, ' '));

        // Build key dictionary
        const key = {};
        for (const [symbol, item] of Object.entries(this.substitutions)) {
            key[symbol] = { item: item };
        }

        return {
            format_version: "1.20.0",
            "minecraft:recipe_shaped": {
                description: {
                    identifier: this.resultIdentifier
                },
                tags: ["crafting_table"],
                pattern: jsonPattern,
                key: key,
                result: {
                    item: this.resultIdentifier,
                    count: this.count
                }
            }
        };
    }
}

// ========== VANILLA ITEMS DATA ==========
const VANILLA_ITEMS = {
    "Building Blocks": [
        {id: "minecraft:stone", name: "Stone"},
        {id: "minecraft:granite", name: "Granite"},
        {id: "minecraft:diorite", name: "Diorite"},
        {id: "minecraft:andesite", name: "Andesite"},
        {id: "minecraft:cobblestone", name: "Cobblestone"},
        {id: "minecraft:oak_planks", name: "Oak Planks"},
        {id: "minecraft:spruce_planks", name: "Spruce Planks"},
        {id: "minecraft:birch_planks", name: "Birch Planks"},
        {id: "minecraft:jungle_planks", name: "Jungle Planks"},
        {id: "minecraft:acacia_planks", name: "Acacia Planks"},
        {id: "minecraft:dark_oak_planks", name: "Dark Oak Planks"},
        {id: "minecraft:mangrove_planks", name: "Mangrove Planks"},
        {id: "minecraft:cherry_planks", name: "Cherry Planks"},
        {id: "minecraft:bamboo_planks", name: "Bamboo Planks"},
        {id: "minecraft:crimson_planks", name: "Crimson Planks"},
        {id: "minecraft:warped_planks", name: "Warped Planks"},
        {id: "minecraft:glass", name: "Glass"},
        {id: "minecraft:sandstone", name: "Sandstone"},
        {id: "minecraft:wool", name: "Wool"},
        {id: "minecraft:brick_block", name: "Bricks"},
        {id: "minecraft:bookshelf", name: "Bookshelf"},
        {id: "minecraft:mossy_cobblestone", name: "Mossy Cobblestone"},
        {id: "minecraft:obsidian", name: "Obsidian"},
        {id: "minecraft:purpur_block", name: "Purpur Block"},
        {id: "minecraft:stone_bricks", name: "Stone Bricks"},
        {id: "minecraft:nether_bricks", name: "Nether Bricks"},
        {id: "minecraft:end_bricks", name: "End Stone Bricks"},
        {id: "minecraft:prismarine", name: "Prismarine"},
        {id: "minecraft:sea_lantern", name: "Sea Lantern"},
        {id: "minecraft:glowstone", name: "Glowstone"},
        {id: "minecraft:quartz_block", name: "Block of Quartz"},
        {id: "minecraft:concrete", name: "Concrete"},
        {id: "minecraft:terracotta", name: "Terracotta"},
        {id: "minecraft:netherite_block", name: "Block of Netherite"},
        {id: "minecraft:copper_block", name: "Block of Copper"},
        {id: "minecraft:iron_block", name: "Block of Iron"},
        {id: "minecraft:gold_block", name: "Block of Gold"},
        {id: "minecraft:diamond_block", name: "Block of Diamond"},
        {id: "minecraft:emerald_block", name: "Block of Emerald"},
        {id: "minecraft:coal_block", name: "Block of Coal"}
    ],
    "Nature": [
        {id: "minecraft:dirt", name: "Dirt"},
        {id: "minecraft:grass", name: "Grass Block"},
        {id: "minecraft:podzol", name: "Podzol"},
        {id: "minecraft:mycelium", name: "Mycelium"},
        {id: "minecraft:sand", name: "Sand"},
        {id: "minecraft:red_sand", name: "Red Sand"},
        {id: "minecraft:gravel", name: "Gravel"},
        {id: "minecraft:log", name: "Oak Log"},
        {id: "minecraft:log2", name: "Spruce Log"},
        {id: "minecraft:leaves", name: "Oak Leaves"},
        {id: "minecraft:sapling", name: "Oak Sapling"},
        {id: "minecraft:cactus", name: "Cactus"},
        {id: "minecraft:clay", name: "Clay"},
        {id: "minecraft:snow", name: "Snow Block"},
        {id: "minecraft:ice", name: "Ice"},
        {id: "minecraft:packed_ice", name: "Packed Ice"},
        {id: "minecraft:blue_ice", name: "Blue Ice"},
        {id: "minecraft:vine", name: "Vines"},
        {id: "minecraft:moss_block", name: "Moss Block"},
        {id: "minecraft:azalea", name: "Azalea"},
        {id: "minecraft:bamboo", name: "Bamboo"}
    ],
    "Ores & Minerals": [
        {id: "minecraft:coal_ore", name: "Coal Ore"},
        {id: "minecraft:iron_ore", name: "Iron Ore"},
        {id: "minecraft:gold_ore", name: "Gold Ore"},
        {id: "minecraft:diamond_ore", name: "Diamond Ore"},
        {id: "minecraft:emerald_ore", name: "Emerald Ore"},
        {id: "minecraft:lapis_ore", name: "Lapis Lazuli Ore"},
        {id: "minecraft:redstone_ore", name: "Redstone Ore"},
        {id: "minecraft:copper_ore", name: "Copper Ore"},
        {id: "minecraft:nether_gold_ore", name: "Nether Gold Ore"},
        {id: "minecraft:nether_quartz_ore", name: "Nether Quartz Ore"},
        {id: "minecraft:ancient_debris", name: "Ancient Debris"},
        {id: "minecraft:coal", name: "Coal"},
        {id: "minecraft:iron_ingot", name: "Iron Ingot"},
        {id: "minecraft:gold_ingot", name: "Gold Ingot"},
        {id: "minecraft:diamond", name: "Diamond"},
        {id: "minecraft:emerald", name: "Emerald"},
        {id: "minecraft:lapis_lazuli", name: "Lapis Lazuli"},
        {id: "minecraft:redstone", name: "Redstone Dust"},
        {id: "minecraft:copper_ingot", name: "Copper Ingot"},
        {id: "minecraft:netherite_ingot", name: "Netherite Ingot"},
        {id: "minecraft:netherite_scrap", name: "Netherite Scrap"},
        {id: "minecraft:quartz", name: "Nether Quartz"},
        {id: "minecraft:amethyst_shard", name: "Amethyst Shard"}
    ],
    "Tools & Weapons": [
        {id: "minecraft:wooden_pickaxe", name: "Wooden Pickaxe"},
        {id: "minecraft:wooden_axe", name: "Wooden Axe"},
        {id: "minecraft:wooden_shovel", name: "Wooden Shovel"},
        {id: "minecraft:wooden_hoe", name: "Wooden Hoe"},
        {id: "minecraft:wooden_sword", name: "Wooden Sword"},
        {id: "minecraft:stone_pickaxe", name: "Stone Pickaxe"},
        {id: "minecraft:stone_axe", name: "Stone Axe"},
        {id: "minecraft:stone_shovel", name: "Stone Shovel"},
        {id: "minecraft:stone_hoe", name: "Stone Hoe"},
        {id: "minecraft:stone_sword", name: "Stone Sword"},
        {id: "minecraft:iron_pickaxe", name: "Iron Pickaxe"},
        {id: "minecraft:iron_axe", name: "Iron Axe"},
        {id: "minecraft:iron_shovel", name: "Iron Shovel"},
        {id: "minecraft:iron_hoe", name: "Iron Hoe"},
        {id: "minecraft:iron_sword", name: "Iron Sword"},
        {id: "minecraft:golden_pickaxe", name: "Golden Pickaxe"},
        {id: "minecraft:golden_axe", name: "Golden Axe"},
        {id: "minecraft:golden_shovel", name: "Golden Shovel"},
        {id: "minecraft:golden_hoe", name: "Golden Hoe"},
        {id: "minecraft:golden_sword", name: "Golden Sword"},
        {id: "minecraft:diamond_pickaxe", name: "Diamond Pickaxe"},
        {id: "minecraft:diamond_axe", name: "Diamond Axe"},
        {id: "minecraft:diamond_shovel", name: "Diamond Shovel"},
        {id: "minecraft:diamond_hoe", name: "Diamond Hoe"},
        {id: "minecraft:diamond_sword", name: "Diamond Sword"},
        {id: "minecraft:netherite_pickaxe", name: "Netherite Pickaxe"},
        {id: "minecraft:netherite_axe", name: "Netherite Axe"},
        {id: "minecraft:netherite_shovel", name: "Netherite Shovel"},
        {id: "minecraft:netherite_hoe", name: "Netherite Hoe"},
        {id: "minecraft:netherite_sword", name: "Netherite Sword"},
        {id: "minecraft:bow", name: "Bow"},
        {id: "minecraft:crossbow", name: "Crossbow"},
        {id: "minecraft:arrow", name: "Arrow"},
        {id: "minecraft:spectral_arrow", name: "Spectral Arrow"},
        {id: "minecraft:trident", name: "Trident"},
        {id: "minecraft:shield", name: "Shield"},
        {id: "minecraft:shears", name: "Shears"},
        {id: "minecraft:fishing_rod", name: "Fishing Rod"},
        {id: "minecraft:flint_and_steel", name: "Flint and Steel"}
    ],
    "Armor": [
        {id: "minecraft:leather_helmet", name: "Leather Cap"},
        {id: "minecraft:leather_chestplate", name: "Leather Tunic"},
        {id: "minecraft:leather_leggings", name: "Leather Pants"},
        {id: "minecraft:leather_boots", name: "Leather Boots"},
        {id: "minecraft:chainmail_helmet", name: "Chainmail Helmet"},
        {id: "minecraft:chainmail_chestplate", name: "Chainmail Chestplate"},
        {id: "minecraft:chainmail_leggings", name: "Chainmail Leggings"},
        {id: "minecraft:chainmail_boots", name: "Chainmail Boots"},
        {id: "minecraft:iron_helmet", name: "Iron Helmet"},
        {id: "minecraft:iron_chestplate", name: "Iron Chestplate"},
        {id: "minecraft:iron_leggings", name: "Iron Leggings"},
        {id: "minecraft:iron_boots", name: "Iron Boots"},
        {id: "minecraft:golden_helmet", name: "Golden Helmet"},
        {id: "minecraft:golden_chestplate", name: "Golden Chestplate"},
        {id: "minecraft:golden_leggings", name: "Golden Leggings"},
        {id: "minecraft:golden_boots", name: "Golden Boots"},
        {id: "minecraft:diamond_helmet", name: "Diamond Helmet"},
        {id: "minecraft:diamond_chestplate", name: "Diamond Chestplate"},
        {id: "minecraft:diamond_leggings", name: "Diamond Leggings"},
        {id: "minecraft:diamond_boots", name: "Diamond Boots"},
        {id: "minecraft:netherite_helmet", name: "Netherite Helmet"},
        {id: "minecraft:netherite_chestplate", name: "Netherite Chestplate"},
        {id: "minecraft:netherite_leggings", name: "Netherite Leggings"},
        {id: "minecraft:netherite_boots", name: "Netherite Boots"},
        {id: "minecraft:turtle_helmet", name: "Turtle Shell"}
    ],
    "Food": [
        {id: "minecraft:apple", name: "Apple"},
        {id: "minecraft:golden_apple", name: "Golden Apple"},
        {id: "minecraft:enchanted_golden_apple", name: "Enchanted Golden Apple"},
        {id: "minecraft:bread", name: "Bread"},
        {id: "minecraft:cookie", name: "Cookie"},
        {id: "minecraft:cake", name: "Cake"},
        {id: "minecraft:pumpkin_pie", name: "Pumpkin Pie"},
        {id: "minecraft:melon", name: "Melon Slice"},
        {id: "minecraft:carrot", name: "Carrot"},
        {id: "minecraft:golden_carrot", name: "Golden Carrot"},
        {id: "minecraft:potato", name: "Potato"},
        {id: "minecraft:baked_potato", name: "Baked Potato"},
        {id: "minecraft:poisonous_potato", name: "Poisonous Potato"},
        {id: "minecraft:beetroot", name: "Beetroot"},
        {id: "minecraft:beetroot_soup", name: "Beetroot Soup"},
        {id: "minecraft:mushroom_stew", name: "Mushroom Stew"},
        {id: "minecraft:rabbit_stew", name: "Rabbit Stew"},
        {id: "minecraft:suspicious_stew", name: "Suspicious Stew"},
        {id: "minecraft:cooked_beef", name: "Steak"},
        {id: "minecraft:cooked_porkchop", name: "Cooked Porkchop"},
        {id: "minecraft:cooked_chicken", name: "Cooked Chicken"},
        {id: "minecraft:cooked_mutton", name: "Cooked Mutton"},
        {id: "minecraft:cooked_rabbit", name: "Cooked Rabbit"},
        {id: "minecraft:cooked_cod", name: "Cooked Cod"},
        {id: "minecraft:cooked_salmon", name: "Cooked Salmon"},
        {id: "minecraft:dried_kelp", name: "Dried Kelp"},
        {id: "minecraft:sweet_berries", name: "Sweet Berries"},
        {id: "minecraft:glow_berries", name: "Glow Berries"},
        {id: "minecraft:chorus_fruit", name: "Chorus Fruit"},
        {id: "minecraft:honey_bottle", name: "Honey Bottle"}
    ],
    "Redstone & Mechanisms": [
        {id: "minecraft:redstone_torch", name: "Redstone Torch"},
        {id: "minecraft:lever", name: "Lever"},
        {id: "minecraft:button", name: "Button"},
        {id: "minecraft:wooden_pressure_plate", name: "Wooden Pressure Plate"},
        {id: "minecraft:stone_pressure_plate", name: "Stone Pressure Plate"},
        {id: "minecraft:tripwire_hook", name: "Tripwire Hook"},
        {id: "minecraft:redstone_lamp", name: "Redstone Lamp"},
        {id: "minecraft:piston", name: "Piston"},
        {id: "minecraft:sticky_piston", name: "Sticky Piston"},
        {id: "minecraft:dispenser", name: "Dispenser"},
        {id: "minecraft:dropper", name: "Dropper"},
        {id: "minecraft:hopper", name: "Hopper"},
        {id: "minecraft:observer", name: "Observer"},
        {id: "minecraft:repeater", name: "Redstone Repeater"},
        {id: "minecraft:comparator", name: "Redstone Comparator"},
        {id: "minecraft:daylight_detector", name: "Daylight Detector"},
        {id: "minecraft:note_block", name: "Note Block"},
        {id: "minecraft:jukebox", name: "Jukebox"},
        {id: "minecraft:tnt", name: "TNT"},
        {id: "minecraft:rail", name: "Rail"},
        {id: "minecraft:powered_rail", name: "Powered Rail"},
        {id: "minecraft:detector_rail", name: "Detector Rail"},
        {id: "minecraft:activator_rail", name: "Activator Rail"},
        {id: "minecraft:minecart", name: "Minecart"},
        {id: "minecraft:chest_minecart", name: "Minecart with Chest"},
        {id: "minecraft:furnace_minecart", name: "Minecart with Furnace"},
        {id: "minecraft:hopper_minecart", name: "Minecart with Hopper"},
        {id: "minecraft:tnt_minecart", name: "Minecart with TNT"}
    ],
    "Crafting Materials": [
        {id: "minecraft:stick", name: "Stick"},
        {id: "minecraft:string", name: "String"},
        {id: "minecraft:feather", name: "Feather"},
        {id: "minecraft:gunpowder", name: "Gunpowder"},
        {id: "minecraft:wheat", name: "Wheat"},
        {id: "minecraft:flint", name: "Flint"},
        {id: "minecraft:snowball", name: "Snowball"},
        {id: "minecraft:egg", name: "Egg"},
        {id: "minecraft:sugar", name: "Sugar"},
        {id: "minecraft:bone", name: "Bone"},
        {id: "minecraft:bone_meal", name: "Bone Meal"},
        {id: "minecraft:ink_sac", name: "Ink Sac"},
        {id: "minecraft:slime_ball", name: "Slimeball"},
        {id: "minecraft:ender_pearl", name: "Ender Pearl"},
        {id: "minecraft:blaze_rod", name: "Blaze Rod"},
        {id: "minecraft:blaze_powder", name: "Blaze Powder"},
        {id: "minecraft:magma_cream", name: "Magma Cream"},
        {id: "minecraft:ender_eye", name: "Eye of Ender"},
        {id: "minecraft:ghast_tear", name: "Ghast Tear"},
        {id: "minecraft:nether_star", name: "Nether Star"},
        {id: "minecraft:prismarine_shard", name: "Prismarine Shard"},
        {id: "minecraft:prismarine_crystals", name: "Prismarine Crystals"},
        {id: "minecraft:rabbit_hide", name: "Rabbit Hide"},
        {id: "minecraft:rabbit_foot", name: "Rabbit's Foot"},
        {id: "minecraft:shulker_shell", name: "Shulker Shell"},
        {id: "minecraft:phantom_membrane", name: "Phantom Membrane"},
        {id: "minecraft:nautilus_shell", name: "Nautilus Shell"},
        {id: "minecraft:heart_of_the_sea", name: "Heart of the Sea"},
        {id: "minecraft:scute", name: "Scute"},
        {id: "minecraft:honeycomb", name: "Honeycomb"},
        {id: "minecraft:echo_shard", name: "Echo Shard"},
        {id: "minecraft:disc_fragment_5", name: "Disc Fragment"}
    ],
    "Utility Items": [
        {id: "minecraft:bucket", name: "Bucket"},
        {id: "minecraft:water_bucket", name: "Water Bucket"},
        {id: "minecraft:lava_bucket", name: "Lava Bucket"},
        {id: "minecraft:milk_bucket", name: "Milk Bucket"},
        {id: "minecraft:powder_snow_bucket", name: "Powder Snow Bucket"},
        {id: "minecraft:compass", name: "Compass"},
        {id: "minecraft:recovery_compass", name: "Recovery Compass"},
        {id: "minecraft:clock", name: "Clock"},
        {id: "minecraft:map", name: "Map"},
        {id: "minecraft:spyglass", name: "Spyglass"},
        {id: "minecraft:lead", name: "Lead"},
        {id: "minecraft:name_tag", name: "Name Tag"},
        {id: "minecraft:saddle", name: "Saddle"},
        {id: "minecraft:bed", name: "Bed"},
        {id: "minecraft:torch", name: "Torch"},
        {id: "minecraft:soul_torch", name: "Soul Torch"},
        {id: "minecraft:lantern", name: "Lantern"},
        {id: "minecraft:soul_lantern", name: "Soul Lantern"},
        {id: "minecraft:campfire", name: "Campfire"},
        {id: "minecraft:soul_campfire", name: "Soul Campfire"},
        {id: "minecraft:crafting_table", name: "Crafting Table"},
        {id: "minecraft:furnace", name: "Furnace"},
        {id: "minecraft:blast_furnace", name: "Blast Furnace"},
        {id: "minecraft:smoker", name: "Smoker"},
        {id: "minecraft:chest", name: "Chest"},
        {id: "minecraft:ender_chest", name: "Ender Chest"},
        {id: "minecraft:shulker_box", name: "Shulker Box"},
        {id: "minecraft:barrel", name: "Barrel"},
        {id: "minecraft:anvil", name: "Anvil"},
        {id: "minecraft:grindstone", name: "Grindstone"},
        {id: "minecraft:enchanting_table", name: "Enchanting Table"},
        {id: "minecraft:brewing_stand", name: "Brewing Stand"},
        {id: "minecraft:cauldron", name: "Cauldron"},
        {id: "minecraft:beacon", name: "Beacon"},
        {id: "minecraft:conduit", name: "Conduit"},
        {id: "minecraft:lectern", name: "Lectern"},
        {id: "minecraft:composter", name: "Composter"},
        {id: "minecraft:stonecutter", name: "Stonecutter"},
        {id: "minecraft:loom", name: "Loom"},
        {id: "minecraft:smithing_table", name: "Smithing Table"},
        {id: "minecraft:cartography_table", name: "Cartography Table"},
        {id: "minecraft:fletching_table", name: "Fletching Table"}
    ]
};

// Grid View state
let currentView = 'text'; // 'text' or 'grid'
let gridData1 = { pattern: Array(9).fill(null), result: null }; // Tab 1 grid data
let gridData2 = { pattern: Array(9).fill(null), result: null }; // Tab 2 grid data
let currentSelectorTarget = null; // {type: 'cell'|'result', tab: 1|2, index: number}
let customItems = []; // Custom items from MCADDON (Tab 2 only)
let allItems = []; // Combined vanilla + custom items

// Global state
let currentTab = 0;
let txtFile1 = null;
let txtFile2 = null;
let mcaddonFile = null;

// MCADDON Editor state
let editorMcAddonFile = null;
let editorZip = null;
let jsonFiles = [];
let currentEditingFile = null;
let currentEditingPath = null;

// Combine MCADDON state
let combineSourceFile = null;
let combineDestFile = null;
let combinedZip = null;

// Diff MCADDON state
let diffFile1 = null;
let diffFile2 = null;
let diffFile1Zip = null;
let diffFile2Zip = null;
let diffResults = null;

// Builtin Features state
let builtinSelectedFeature = null;
let builtinMcAddonFile = null;
let builtinZip = null;
let builtinFilteredItems = [];
let builtinSelectedItem = null;
let builtinFoodEffects = [];
let builtinEffectCounter = 0;
let builtinModifiedZip = null;

// ========== PNG Editor State ==========
let pngMcAddonFile = null;
let pngZip = null;
let pngCurrentOperation = null;
let pngFiles = [];
let pngSelectedPath = null;
let pngLocalFile = null;
let pngLocalFileData = null;
let pngModifiedZip = null;

// Builtin Features definitions
const builtinFeatures = [
    {
        id: 'food_effects',
        name: 'Food Effects',
        description: 'Add effects to food items',
        filterFunction: async (zip) => {
            const items = [];

            // Find behavior pack
            const behaviorPack = await findBehaviorPack(zip);
            if (!behaviorPack) {
                return items;
            }

            // Search for items with minecraft:food component
            for (const [path, zipEntry] of Object.entries(zip.files)) {
                if (zipEntry.dir) continue;
                if (!path.toLowerCase().includes('/items/')) continue;
                if (!path.toLowerCase().endsWith('.json')) continue;

                try {
                    const content = await zipEntry.async('string');
                    const itemData = JSON.parse(content);

                    // Check if item has minecraft:food component
                    if (itemData['minecraft:item'] &&
                        itemData['minecraft:item'].components &&
                        itemData['minecraft:item'].components['minecraft:food']) {

                        const identifier = itemData['minecraft:item'].description?.identifier || 'Unknown';
                        items.push({
                            path: path,
                            identifier: identifier,
                            content: content,
                            data: itemData
                        });
                    }
                } catch (e) {
                    // Invalid JSON or structure, skip
                }
            }

            return items;
        }
    }
];

// Screen switching
function switchScreen(screenIndex) {
    const navButtons = document.querySelectorAll('.nav-button');
    const screens = document.querySelectorAll('.screen');

    navButtons.forEach((btn, index) => {
        if (index === screenIndex) {
            btn.classList.add('active');
            screens[index].classList.add('active');
        } else {
            btn.classList.remove('active');
            screens[index].classList.remove('active');
        }
    });
}

// Recipe tab switching
function switchRecipeTab(tabIndex) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
            contents[index].classList.add('active');
        } else {
            tab.classList.remove('active');
            contents[index].classList.remove('active');
        }
    });

    currentTab = tabIndex;
    clearResults();
}

// Workflow tab switching
function switchWorkflowTab(tabIndex) {
    const tabs = document.querySelectorAll('.workflow-tab');
    const contents = document.querySelectorAll('.workflow-tab-content');

    // Check if tab is enabled
    if (!tabs[tabIndex].classList.contains('enabled')) {
        return;
    }

    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
            contents[index].classList.add('active');
        } else {
            tab.classList.remove('active');
            contents[index].classList.remove('active');
        }
    });
}

// File selection handlers
function handleFileSelect(tabNum) {
    const file = getSelectedFile(`txtFile${tabNum}`);
    if (file) {
        if (tabNum === 1) {
            txtFile1 = file;
        } else {
            txtFile2 = file;
        }

        updateFileInfo(`fileInfo${tabNum}`, file);

        // Enable button based on tab requirements
        if (tabNum === 1) {
            enableButton(`convertBtn${tabNum}`, true);
        } else {
            enableButton(`convertBtn${tabNum}`, !!mcaddonFile);
        }
    }
}

function handleMcAddonSelect() {
    const file = getSelectedFile('mcaddonFile');
    if (file) {
        mcaddonFile = file;
        updateFileInfo('mcaddonInfo', file);

        // Enable button if txt file is also selected
        enableButton('convertBtn2', !!txtFile2);
    }
}

// Convert to JSON only (Tab 1)
async function convertToJson() {
    if (!txtFile1) {
        showResult(1, 'error', 'No file selected', 'Please select a recipe file first.');
        return;
    }

    try {
        const content = await readFileAsText(txtFile1);
        const parser = new RecipeParser(content);
        parser.parse();
        const recipeJson = parser.toJson();

        // Create JSON string
        const jsonString = JSON.stringify(recipeJson, null, 2);

        // Download JSON file
        const fileName = txtFile1.name.replace(/\.txt$/i, '.json');
        downloadFile(jsonString, fileName, 'application/json');

        showResult(1, 'success', 'Success!', `JSON file "${fileName}" has been downloaded.`);
    } catch (error) {
        showResult(1, 'error', 'Error', error.message);
    }
}

// Convert and inject into McAddon (Tab 2)
async function convertAndInject() {
    if (!txtFile2 || !mcaddonFile) {
        showResult(2, 'error', 'Missing files', 'Please select both recipe and McAddon files.');
        return;
    }

    try {
        // Parse recipe
        const content = await readFileAsText(txtFile2);
        const parser = new RecipeParser(content);
        parser.parse();
        const recipeJson = parser.toJson();

        // Load MCADDON file
        const zip = await loadMcAddonZip(mcaddonFile);

        // Find behavior pack directory
        const behaviorPack = await findBehaviorPack(zip);
        if (!behaviorPack) {
            throw new Error('Could not find behavior pack in McAddon file');
        }

        // Create recipes directory path
        const recipesPath = constructPackPath(behaviorPack, 'recipes');

        // Add recipe to zip
        const recipeFileName = txtFile2.name.replace(/\.txt$/i, '.json');
        const recipeFilePath = recipesPath + recipeFileName;

        zip.file(recipeFilePath, JSON.stringify(recipeJson, null, 2));

        // Generate new zip
        const newZipBlob = await zip.generateAsync({ type: 'blob' });

        // Generate output filename with incrementing number
        const baseName = mcaddonFile.name.replace(/\.mcaddon$/i, '');
        const outputFileName = `${baseName}_web.mcaddon`;

        // Download the new mcaddon
        downloadBlob(newZipBlob, outputFileName);

        showResult(2, 'success', 'Success!',
            `Created "${outputFileName}" with recipe "${recipeFileName}" included.`);
    } catch (error) {
        showResult(2, 'error', 'Error', error.message);
    }
}

// Utility functions
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, fileName);
}

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ========== GRID VIEW FUNCTIONS ==========

// Switch between text and grid view
function switchRecipeView(view) {
    currentView = view;

    // Update toggle button states
    const textBtn = document.getElementById('textViewBtn');
    const gridBtn = document.getElementById('gridViewBtn');

    if (view === 'text') {
        textBtn.classList.add('active');
        gridBtn.classList.remove('active');

        // Show text view, hide grid view for both tabs
        document.getElementById('tab1-text-view').style.display = 'block';
        document.getElementById('tab1-grid-view').style.display = 'none';
        document.getElementById('tab2-text-view').style.display = 'block';
        document.getElementById('tab2-grid-view').style.display = 'none';
    } else {
        textBtn.classList.remove('active');
        gridBtn.classList.add('active');

        // Show grid view, hide text view for both tabs
        document.getElementById('tab1-text-view').style.display = 'none';
        document.getElementById('tab1-grid-view').style.display = 'block';
        document.getElementById('tab2-text-view').style.display = 'none';
        document.getElementById('tab2-grid-view').style.display = 'block';
    }
}

// Initialize grid cells on page load
function initializeGrids() {
    // Initialize Tab 1 grid
    const grid1 = document.getElementById('craftingGrid1');
    grid1.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.id = `grid1-cell-${i}`;
        cell.innerHTML = `
            <div class="cell-display" onclick="openItemSelector('cell', 1, ${i})">
                <span class="cell-placeholder">Empty</span>
            </div>
        `;
        grid1.appendChild(cell);
    }

    // Initialize Tab 2 grid
    const grid2 = document.getElementById('craftingGrid2');
    grid2.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.id = `grid2-cell-${i}`;
        cell.innerHTML = `
            <div class="cell-display" onclick="openItemSelector('cell', 2, ${i})">
                <span class="cell-placeholder">Empty</span>
            </div>
        `;
        grid2.appendChild(cell);
    }

    // Initialize all items array with vanilla items
    refreshAllItems();
}

// Refresh the combined items list (vanilla + custom)
function refreshAllItems() {
    allItems = [];

    // Add custom items first (for Tab 2)
    if (customItems.length > 0) {
        allItems.push({
            category: "Custom Items",
            items: customItems
        });
    }

    // Add vanilla items
    for (const [category, items] of Object.entries(VANILLA_ITEMS)) {
        allItems.push({ category, items });
    }
}

// Open item selector modal
function openItemSelector(type, tab, index = null) {
    currentSelectorTarget = { type, tab, index };

    // Populate item list
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    for (const categoryData of allItems) {
        // Add category header
        const header = document.createElement('div');
        header.className = 'item-category-header';
        header.textContent = categoryData.category;
        itemList.appendChild(header);

        // Add items
        for (const item of categoryData.items) {
            const itemEl = document.createElement('div');
            itemEl.className = 'item-list-item';
            itemEl.onclick = () => selectItem(item);
            itemEl.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-identifier">${item.id}</div>
            `;
            itemList.appendChild(itemEl);
        }
    }

    // Clear search input
    document.getElementById('itemSearchInput').value = '';

    // Show modal
    document.getElementById('itemSelectorModal').style.display = 'block';
}

// Close item selector modal
function closeItemSelector() {
    document.getElementById('itemSelectorModal').style.display = 'none';
    currentSelectorTarget = null;
}

// Filter items based on search input
function filterItems() {
    const searchTerm = document.getElementById('itemSearchInput').value.toLowerCase();
    const items = document.querySelectorAll('.item-list-item');
    const headers = document.querySelectorAll('.item-category-header');

    items.forEach(item => {
        const name = item.querySelector('.item-name').textContent.toLowerCase();
        const id = item.querySelector('.item-identifier').textContent.toLowerCase();
        if (name.includes(searchTerm) || id.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Hide category headers if no items are visible in that category
    headers.forEach(header => {
        let nextEl = header.nextElementSibling;
        let hasVisibleItems = false;
        while (nextEl && !nextEl.classList.contains('item-category-header')) {
            if (nextEl.classList.contains('item-list-item') && nextEl.style.display !== 'none') {
                hasVisibleItems = true;
                break;
            }
            nextEl = nextEl.nextElementSibling;
        }
        header.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Select an item from the modal
function selectItem(item) {
    const { type, tab, index } = currentSelectorTarget;

    if (type === 'cell') {
        // Update grid cell
        const gridData = tab === 1 ? gridData1 : gridData2;
        gridData.pattern[index] = item;

        // Update UI
        const cell = document.getElementById(`grid${tab}-cell-${index}`);
        cell.classList.add('filled');
        cell.querySelector('.cell-display').innerHTML = `
            <span class="cell-item-name">${item.name}</span>
        `;
    } else if (type === 'result') {
        // Update result cell
        const gridData = tab === 1 ? gridData1 : gridData2;
        gridData.result = item;

        // Update UI
        const cell = document.getElementById(`resultCell${tab}`);
        cell.classList.add('filled');
        cell.querySelector('.cell-display').innerHTML = `
            <span class="cell-item-name">${item.name}</span>
        `;
    }

    closeItemSelector();
}

// Clear grid
function clearGrid(tab) {
    const gridData = tab === 1 ? gridData1 : gridData2;

    // Reset data
    gridData.pattern = Array(9).fill(null);
    gridData.result = null;

    // Reset UI for pattern cells
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`grid${tab}-cell-${i}`);
        cell.classList.remove('filled');
        cell.querySelector('.cell-display').innerHTML = `
            <span class="cell-placeholder">Empty</span>
        `;
    }

    // Reset result cell
    const resultCell = document.getElementById(`resultCell${tab}`);
    resultCell.classList.remove('filled');
    resultCell.querySelector('.cell-display').innerHTML = `
        <span class="cell-placeholder">Click to select result</span>
    `;

    // Reset count
    document.getElementById(`resultCount${tab}`).value = 1;

    // Clear result message
    document.getElementById(`gridResult${tab}`).innerHTML = '';
}

// Convert grid to JSON
async function convertGridToJson(tab) {
    const gridData = tab === 1 ? gridData1 : gridData2;
    const count = parseInt(document.getElementById(`resultCount${tab}`).value);

    // Validate grid data
    if (!gridData.result) {
        showGridResult(tab, 'error', 'Missing Result', 'Please select a result item.');
        return;
    }

    if (isNaN(count) || count < 1 || count > 64) {
        showGridResult(tab, 'error', 'Invalid Count', 'Result count must be between 1 and 64.');
        return;
    }

    // Check if there are any items in the pattern
    const hasItems = gridData.pattern.some(item => item !== null);
    if (!hasItems) {
        showGridResult(tab, 'error', 'Empty Pattern', 'Please add at least one item to the crafting grid.');
        return;
    }

    try {
        // Build pattern (3x3)
        const pattern = [];
        const key = {};
        const symbolMap = {}; // Map item IDs to symbols
        let symbolIndex = 0;
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let row = 0; row < 3; row++) {
            let patternRow = '';
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                const item = gridData.pattern[index];

                if (item === null) {
                    patternRow += ' ';
                } else {
                    // Get or create symbol for this item
                    if (!symbolMap[item.id]) {
                        symbolMap[item.id] = symbols[symbolIndex];
                        key[symbols[symbolIndex]] = { item: item.id };
                        symbolIndex++;
                    }
                    patternRow += symbolMap[item.id];
                }
            }
            pattern.push(patternRow);
        }

        // Build JSON
        const recipeJson = {
            format_version: "1.20.0",
            "minecraft:recipe_shaped": {
                description: {
                    identifier: gridData.result.id
                },
                tags: ["crafting_table"],
                pattern: pattern,
                key: key,
                result: {
                    item: gridData.result.id,
                    count: count
                }
            }
        };

        // Handle Tab 1 (JSON only) or Tab 2 (JSON + McAddon)
        if (tab === 1) {
            // Download JSON file
            const jsonString = JSON.stringify(recipeJson, null, 2);
            const fileName = gridData.result.id.replace(':', '_') + '.json';
            downloadFile(jsonString, fileName, 'application/json');

            showGridResult(tab, 'success', 'Recipe Created!',
                `Recipe JSON file "${fileName}" has been downloaded to your Downloads folder.`);
        } else {
            // Tab 2: Inject into MCADDON
            const mcaddonFileGrid = document.getElementById('mcaddonFileGrid').files[0];
            if (!mcaddonFileGrid) {
                showGridResult(tab, 'error', 'Missing McAddon', 'Please select an MCADDON file first.');
                return;
            }

            const zip = await loadMcAddonZip(mcaddonFileGrid);
            const behaviorPackPath = await findBehaviorPack(zip);

            if (!behaviorPackPath) {
                showGridResult(tab, 'error', 'Invalid McAddon', 'Could not find behavior pack in MCADDON file.');
                return;
            }

            // Add recipe to MCADDON
            const prefix = behaviorPackPath === '.' ? '' : behaviorPackPath + '/';
            const recipePath = prefix + 'recipes/' + gridData.result.id.replace(':', '_') + '.json';
            zip.file(recipePath, JSON.stringify(recipeJson, null, 2));

            // Generate and download modified MCADDON
            const blob = await zip.generateAsync({ type: 'blob' });
            const fileName = mcaddonFileGrid.name.replace('.mcaddon', '_with_recipe.mcaddon');
            downloadBlob(blob, fileName);

            showGridResult(tab, 'success', 'McAddon Created!',
                `Modified MCADDON file "${fileName}" has been downloaded with your recipe.`);
        }
    } catch (error) {
        showGridResult(tab, 'error', 'Conversion Failed', error.message);
    }
}

// Show result message for grid view
function showGridResult(tab, type, title, message) {
    const resultDiv = document.getElementById(`gridResult${tab}`);
    const icon = type === 'success' ? '✓' : '✗';
    const colorClass = type === 'success' ? '#27ae60' : '#e74c3c';

    resultDiv.innerHTML = `
        <div style="padding: 20px; border: 2px solid ${colorClass}; border-radius: 8px; background: ${type === 'success' ? '#d4edda' : '#f8d7da'}; margin-top: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: ${colorClass}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">${icon}</div>
                <h3 style="margin: 0; color: ${colorClass};">${title}</h3>
            </div>
            <p style="margin: 0; color: #2c3e50;">${message}</p>
        </div>
    `;
}

// Handle MCADDON file selection for grid view (Tab 2)
async function handleMcAddonGridSelect() {
    const fileInput = document.getElementById('mcaddonFileGrid');
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    const fileInfo = document.getElementById('mcaddonGridInfo');
    fileInfo.innerHTML = `
        <div style="padding: 10px; background: #e7f5ff; border: 1px solid #74c0fc; border-radius: 6px; margin-top: 10px;">
            <strong>${file.name}</strong> (${formatFileSize(file.size)})
            <div style="margin-top: 5px;">Scanning for custom items...</div>
        </div>
    `;

    try {
        // Load MCADDON and scan for custom items
        const zip = await loadMcAddonZip(file);
        const behaviorPackPath = await findBehaviorPack(zip);

        if (!behaviorPackPath) {
            fileInfo.innerHTML = `
                <div style="padding: 10px; background: #f8d7da; border: 1px solid #e74c3c; border-radius: 6px; margin-top: 10px;">
                    <strong>Error:</strong> Could not find behavior pack in MCADDON file.
                </div>
            `;
            return;
        }

        // Scan for custom items and blocks
        customItems = [];
        const prefix = behaviorPackPath === '.' ? '' : behaviorPackPath + '/';
        const itemsPath = prefix + 'items/';
        const blocksPath = prefix + 'blocks/';

        for (const [path, zipEntry] of Object.entries(zip.files)) {
            if (zipEntry.dir) continue;
            if (!path.endsWith('.json')) continue;

            // Check if it's an item or block
            const isItem = path.startsWith(itemsPath);
            const isBlock = path.startsWith(blocksPath);

            if (isItem || isBlock) {
                try {
                    const content = await zipEntry.async('string');
                    const data = JSON.parse(content);

                    let identifier = null;

                    // Check for item
                    if (data['minecraft:item'] && data['minecraft:item'].description) {
                        identifier = data['minecraft:item'].description.identifier;
                    }
                    // Check for block
                    else if (data['minecraft:block'] && data['minecraft:block'].description) {
                        identifier = data['minecraft:block'].description.identifier;
                    }

                    if (identifier) {
                        const name = identifier.split(':')[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        customItems.push({ id: identifier, name: name });
                    }
                } catch (e) {
                    // Skip invalid JSON files
                }
            }
        }

        // Refresh all items to include custom items
        refreshAllItems();

        const customItemCount = customItems.length;
        fileInfo.innerHTML = `
            <div style="padding: 10px; background: #d4edda; border: 1px solid #27ae60; border-radius: 6px; margin-top: 10px;">
                <strong>${file.name}</strong> (${formatFileSize(file.size)})
                <div style="margin-top: 5px;">✓ Loaded successfully! Found ${customItemCount} custom item${customItemCount !== 1 ? 's' : ''} and block${customItemCount !== 1 ? 's' : ''}.</div>
            </div>
        `;
    } catch (error) {
        fileInfo.innerHTML = `
            <div style="padding: 10px; background: #f8d7da; border: 1px solid #e74c3c; border-radius: 6px; margin-top: 10px;">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

// ========== MCADDON ZIP UTILITIES ==========

/**
 * Load an MCADDON file as a JSZip object
 */
async function loadMcAddonZip(file) {
    const data = await readFileAsArrayBuffer(file);
    return await JSZip.loadAsync(data);
}

/**
 * Find the behavior pack folder in an MCADDON ZIP
 * Returns the folder path or null if not found
 */
async function findBehaviorPack(zip) {
    for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir && path.includes('manifest.json') === false) continue;

        const manifestPath = path.endsWith('/') ? path + 'manifest.json' : path;
        if (zip.files[manifestPath]) {
            try {
                const manifestContent = await zip.files[manifestPath].async('string');
                const manifest = JSON.parse(manifestContent);

                if (manifest.modules) {
                    for (const module of manifest.modules) {
                        if (module.type === 'data') {
                            let behaviorPack = path.endsWith('/') ? path.slice(0, -1) : path.substring(0, path.lastIndexOf('/'));
                            if (behaviorPack === '') behaviorPack = '.';
                            return behaviorPack;
                        }
                    }
                }
            } catch (e) {
                // Not a valid manifest, continue
            }
        }
    }
    return null;
}

/**
 * Find the resources pack folder in an MCADDON ZIP
 * Returns the folder path or null if not found
 */
async function findResourcesPack(zip) {
    for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir && path.includes('manifest.json') === false) continue;

        const manifestPath = path.endsWith('/') ? path + 'manifest.json' : path;
        if (zip.files[manifestPath]) {
            try {
                const manifestContent = await zip.files[manifestPath].async('string');
                const manifest = JSON.parse(manifestContent);

                if (manifest.modules) {
                    for (const module of manifest.modules) {
                        if (module.type === 'resources') {
                            let resourcesPack = path.endsWith('/') ? path.slice(0, -1) : path.substring(0, path.lastIndexOf('/'));
                            if (resourcesPack === '') resourcesPack = '.';
                            return resourcesPack;
                        }
                    }
                }
            } catch (e) {
                // Not a valid manifest, continue
            }
        }
    }
    return null;
}

/**
 * Find a resource pack item file by identifier
 * @param {JSZip} zip - The MCADDON ZIP object
 * @param {string} resourcesPack - The resource pack folder path
 * @param {string} identifier - The item identifier (e.g., "namespace:item_name")
 * @returns {string|null} The path to the resource pack item file, or null if not found
 */
async function findResourcePackItemFile(zip, resourcesPack, identifier) {
    // Search in the resource pack's items directory
    for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        if (!path.toLowerCase().includes('/items/')) continue;
        if (!path.toLowerCase().endsWith('.json')) continue;

        // Check if this path is within the resource pack
        if (!path.startsWith(resourcesPack)) continue;

        try {
            const content = await zipEntry.async('string');
            const itemData = JSON.parse(content);

            // Check if this item matches the identifier
            if (itemData['minecraft:item']?.description?.identifier === identifier) {
                return path;
            }
        } catch (e) {
            // Invalid JSON or structure, skip
        }
    }
    return null;
}

/**
 * Convert an item JSON to format_version 1.10 with split BP/RP structure
 * Format 1.10 requires items to be split into two files: one in BP (functional) and one in RP (visual)
 * @param {Object} itemData - The item JSON object
 * @returns {Object} { behaviorPackData, resourcePackData, originalVersion, removedComponents, warnings }
 */
function convertToFormat1_10(itemData) {
    const result = {
        behaviorPackData: null,
        resourcePackData: null,
        originalVersion: itemData.format_version,
        removedComponents: [],
        warnings: []
    };

    if (!itemData['minecraft:item']) {
        return result;
    }

    // Lists of components by category
    const functionalComponents = [
        'minecraft:food',
        'minecraft:max_stack_size',
        'minecraft:hand_equipped',
        'minecraft:stacked_by_data',
        'minecraft:foil',
        'minecraft:allow_off_hand',
        'minecraft:should_despawn',
        'minecraft:liquid_clipped',
        'minecraft:durability',
        'minecraft:on_use',
        'minecraft:on_use_on'
    ];

    const visualComponents = [
        'minecraft:icon'
    ];

    const item = itemData['minecraft:item'];

    // Create Behavior Pack item (functional components only)
    result.behaviorPackData = {
        format_version: "1.10",
        "minecraft:item": {
            description: {
                identifier: item.description?.identifier || 'unknown:item'
            },
            components: {}
        }
    };

    // Create Resource Pack item (visual components only)
    result.resourcePackData = {
        format_version: "1.10",
        "minecraft:item": {
            description: {
                identifier: item.description?.identifier || 'unknown:item'
            },
            components: {}
        }
    };

    // Process components from original item
    if (item.components) {
        for (const [componentName, componentValue] of Object.entries(item.components)) {
            if (functionalComponents.includes(componentName)) {
                // Add to BP file
                result.behaviorPackData['minecraft:item'].components[componentName] =
                    JSON.parse(JSON.stringify(componentValue)); // Deep clone
            } else if (visualComponents.includes(componentName)) {
                // Add to RP file
                result.resourcePackData['minecraft:item'].components[componentName] =
                    JSON.parse(JSON.stringify(componentValue)); // Deep clone
            } else {
                // Component not supported in format 1.10
                result.removedComponents.push(componentName);
            }
        }
    }

    // Handle tags - needs special conversion
    if (item.components?.['minecraft:tags']) {
        const tags = item.components['minecraft:tags'];
        if (tags.tags && Array.isArray(tags.tags)) {
            // Convert from 1.20.50+ object format to 1.10 array format
            result.behaviorPackData['minecraft:item'].components['minecraft:tags'] = tags.tags;
        } else if (Array.isArray(tags)) {
            // Already in correct format
            result.behaviorPackData['minecraft:item'].components['minecraft:tags'] = tags;
        }
    }

    // Add warnings
    if (result.originalVersion && result.originalVersion !== "1.10") {
        result.warnings.push(`Format version changed: ${result.originalVersion} → 1.10`);
        result.warnings.push('Using vanilla Enchanted Golden Apple format (split BP/RP files)');
    }

    result.warnings.push('Items will appear under generic "Items" category in Creative Mode');

    if (result.removedComponents.length > 0) {
        result.warnings.push(`Removed ${result.removedComponents.length} incompatible component(s)`);
    }

    return result;
}

/**
 * Extract JSON files from a ZIP, optionally filtered by path pattern
 * @param {JSZip} zip - The ZIP object
 * @param {Function} pathFilter - Optional function to filter paths (returns true to include)
 * @returns {Array} Array of {path, content, parsed} objects
 */
async function extractJsonFiles(zip, pathFilter = null) {
    const jsonFiles = [];

    for (const [path, entry] of Object.entries(zip.files)) {
        if (!entry.dir && path.toLowerCase().endsWith('.json')) {
            if (pathFilter && !pathFilter(path)) continue;

            try {
                const content = await entry.async('string');
                const parsed = JSON.parse(content);
                jsonFiles.push({
                    path: path,
                    content: content,
                    parsed: parsed
                });
            } catch (e) {
                // Skip invalid JSON files
            }
        }
    }

    return jsonFiles;
}

/**
 * Construct a path within the behavior pack
 * @param {string} behaviorPack - The behavior pack base path
 * @param {string} subPath - The sub-path (e.g., 'recipes', 'items')
 * @returns {string} The full path
 */
function constructPackPath(behaviorPack, subPath) {
    return behaviorPack === '.' ? subPath + '/' : `${behaviorPack}/${subPath}/`;
}

function showResult(tabNum, type, title, message) {
    const result = document.getElementById(`result${tabNum}`);
    result.className = `result ${type} show`;
    result.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="result-message">${message}</div>
    `;
}

function clearResults() {
    document.getElementById('result1').classList.remove('show');
    document.getElementById('result2').classList.remove('show');
}

// ========== UI STATUS & RESULT DISPLAY UTILITIES ==========

/**
 * Display a status message in a result container
 * @param {string} containerId - The ID of the result container element
 * @param {string} type - The type of message: 'success', 'error', 'warning', or '' for neutral
 * @param {string} title - The title of the message
 * @param {string} message - The message content (can include HTML)
 */
function displayStatus(containerId, type, title, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.className = type ? `result ${type} show` : 'result show';
    container.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="result-message">${message}</div>
    `;
}

/**
 * Show a loading status
 */
function showLoading(containerId, message = 'Processing...') {
    displayStatus(containerId, '', 'Processing...', message);
}

/**
 * Show an error status
 */
function showError(containerId, message, title = 'Error') {
    displayStatus(containerId, 'error', title, message);
}

/**
 * Show a success status
 */
function showSuccess(containerId, message, title = 'Success!') {
    displayStatus(containerId, 'success', title, message);
}

/**
 * Hide a result container
 */
function hideStatus(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.remove('show');
    }
}

/**
 * Toggle download button visibility
 */
function toggleDownloadButton(buttonId, show) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.style.display = show ? 'block' : 'none';
    }
}

// ========== FILE SELECTION UTILITIES ==========

/**
 * Update file info display
 * @param {string} infoElementId - The ID of the file info element
 * @param {File} file - The selected file
 */
function updateFileInfo(infoElementId, file) {
    const infoElement = document.getElementById(infoElementId);
    if (infoElement && file) {
        infoElement.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
        infoElement.classList.add('show');
    }
}

/**
 * Enable or disable a button
 * @param {string} buttonId - The ID of the button element
 * @param {boolean} enabled - Whether to enable the button
 */
function enableButton(buttonId, enabled) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = !enabled;
    }
}

/**
 * Get the first selected file from a file input
 * @param {string} inputId - The ID of the file input element
 * @returns {File|null} The selected file or null
 */
function getSelectedFile(inputId) {
    const input = document.getElementById(inputId);
    return input ? input.files[0] : null;
}

// ========== DOWNLOAD UTILITIES ==========

/**
 * Generate a modified filename with a suffix before the extension
 * @param {string} originalFileName - The original file name
 * @param {string} suffix - The suffix to add (e.g., '_web', '_edited')
 * @returns {string} The modified filename
 */
function generateModifiedFileName(originalFileName, suffix) {
    return originalFileName.replace(/\.mcaddon$/i, `${suffix}.mcaddon`);
}

/**
 * Download MCADDON file and show success message
 * @param {JSZip} zip - The ZIP object to download
 * @param {string} originalFileName - The original file name
 * @param {string} suffix - The suffix to add to the filename
 * @param {string} resultContainerId - Optional result container to show success message
 * @returns {Promise<string>} The output filename
 */
async function downloadMcAddon(zip, originalFileName, suffix, resultContainerId = null) {
    const blob = await zip.generateAsync({ type: 'blob' });
    const outputFileName = generateModifiedFileName(originalFileName, suffix);
    downloadBlob(blob, outputFileName);

    if (resultContainerId) {
        showSuccess(resultContainerId, `"${outputFileName}" has been downloaded.`, 'Downloaded!');
    }

    return outputFileName;
}

// ========== MCADDON STRUCTURE VALIDATION UTILITIES ==========

/**
 * Find top-level folders in a ZIP file
 * @param {JSZip} zip - The ZIP object
 * @returns {Object} Map of folder names to boolean (isDir)
 */
function findTopLevelFolders(zip) {
    const topLevelItems = {};

    for (const [path, entry] of Object.entries(zip.files)) {
        const pathParts = path.split('/').filter(p => p.length > 0);
        if (pathParts.length === 0) continue;

        const topLevelName = pathParts[0];

        if (!topLevelItems[topLevelName]) {
            topLevelItems[topLevelName] = {
                isDir: entry.dir || pathParts.length > 1,
                isFile: pathParts.length === 1 && !entry.dir
            };
        }
    }

    return topLevelItems;
}

/**
 * Validate MCADDON structure and return results
 * @param {JSZip} zip - The ZIP object
 * @param {string} fileName - The file name for error messages
 * @param {Object} options - Validation options
 * @returns {Object} Validation results with errors, warnings, behaviorFolder, resourcesFolder
 */
function validateMcAddonStructure(zip, fileName, options = {}) {
    const {
        throwOnError = false,
        extraFoldersAsError = false
    } = options;

    const results = {
        errors: [],
        warnings: [],
        behaviorFolder: null,
        resourcesFolder: null,
        valid: true
    };

    const topLevelItems = findTopLevelFolders(zip);

    // Check for top-level files
    for (const [name, info] of Object.entries(topLevelItems)) {
        if (info.isFile) {
            const error = {
                title: 'Invalid Structure',
                details: extraFoldersAsError
                    ? `Top-level files are not allowed. Found file: ${name}`
                    : 'Top-level files are not allowed in MCADDON packages.',
                path: name
            };

            if (throwOnError) {
                throw new Error(`Invalid structure in "${fileName}": ${error.details}`);
            }

            results.errors.push(error);
            results.valid = false;
        }
    }

    // Find Behavior folder
    const behaviorFolders = Object.keys(topLevelItems).filter(name =>
        name.endsWith('Behavior')
    );

    if (behaviorFolders.length === 0) {
        const error = {
            title: 'Missing Behavior Pack',
            details: 'No folder ending with "Behavior" found at top level.',
            path: null
        };

        if (throwOnError) {
            throw new Error(`Invalid structure in "${fileName}": ${error.details}`);
        }

        results.errors.push(error);
        results.valid = false;
    } else if (behaviorFolders.length > 1) {
        const error = {
            title: 'Multiple Behavior Packs',
            details: `Multiple folders ending with "Behavior" found: ${behaviorFolders.join(', ')}`,
            path: null
        };

        if (throwOnError) {
            throw new Error(`Invalid structure in "${fileName}": ${error.details}`);
        }

        results.errors.push(error);
        results.valid = false;
    } else {
        results.behaviorFolder = behaviorFolders[0];
    }

    // Find Resources folder
    const resourcesFolders = Object.keys(topLevelItems).filter(name =>
        name.endsWith('Resources')
    );

    if (resourcesFolders.length === 0) {
        const error = {
            title: 'Missing Resources Pack',
            details: 'No folder ending with "Resources" found at top level.',
            path: null
        };

        if (throwOnError) {
            throw new Error(`Invalid structure in "${fileName}": ${error.details}`);
        }

        results.errors.push(error);
        results.valid = false;
    } else if (resourcesFolders.length > 1) {
        const error = {
            title: 'Multiple Resources Packs',
            details: `Multiple folders ending with "Resources" found: ${resourcesFolders.join(', ')}`,
            path: null
        };

        if (throwOnError) {
            throw new Error(`Invalid structure in "${fileName}": ${error.details}`);
        }

        results.errors.push(error);
        results.valid = false;
    } else {
        results.resourcesFolder = resourcesFolders[0];
    }

    // Check for extra top-level folders
    const extraFolders = Object.keys(topLevelItems).filter(name =>
        !name.endsWith('Behavior') && !name.endsWith('Resources')
    );

    if (extraFolders.length > 0) {
        const issue = {
            title: extraFoldersAsError ? 'Extra Top-Level Folders' : 'Extra Top-Level Folders',
            details: extraFoldersAsError
                ? `Extra top-level folders found: ${extraFolders.join(', ')}. Only Behavior and Resources folders are allowed.`
                : `Found unexpected top-level folders: ${extraFolders.join(', ')}`,
            path: null
        };

        if (extraFoldersAsError) {
            if (throwOnError) {
                throw new Error(`Invalid structure in "${fileName}": ${issue.details}`);
            }
            results.errors.push(issue);
            results.valid = false;
        } else {
            results.warnings.push(issue);
        }
    }

    return results;
}

// ========== MCADDON EDITOR FUNCTIONS ==========

async function handleMcAddonEditorSelect() {
    const file = getSelectedFile('mcaddonEditorFile');
    if (!file) return;

    editorMcAddonFile = file;
    updateFileInfo('mcaddonEditorInfo', file);

    try {
        // Load the ZIP file
        editorZip = await loadMcAddonZip(file);

        // Extract all JSON files
        const extractedFiles = await extractJsonFiles(editorZip);
        jsonFiles = extractedFiles.map(f => ({
            path: f.path,
            content: f.content,
            size: f.content.length
        }));

        if (jsonFiles.length === 0) {
            throw new Error('No JSON files found in the MCADDON package.');
        }

        // Sort files by path
        jsonFiles.sort((a, b) => a.path.localeCompare(b.path));

        // Show success message
        showSuccess('mcaddon-result', `Found ${jsonFiles.length} JSON file(s) in the package.`);

        // Enable and switch to tab 2
        const tab1 = document.getElementById('workflow-tab-1');
        tab1.classList.add('enabled');

        // Load file list
        loadJsonFileList();

        // Auto-advance to tab 2
        setTimeout(() => {
            switchWorkflowTab(1);
        }, 1000);

    } catch (error) {
        showError('mcaddon-result', error.message);
    }
}

// Build tree structure from flat file list
function buildFileTree() {
    const root = { type: 'folder', name: '', children: {}, files: [] };

    jsonFiles.forEach((file, index) => {
        const parts = file.path.split('/');
        let current = root;

        // Navigate/create folder structure
        for (let i = 0; i < parts.length - 1; i++) {
            const folderName = parts[i];
            if (!current.children[folderName]) {
                current.children[folderName] = {
                    type: 'folder',
                    name: folderName,
                    children: {},
                    files: []
                };
            }
            current = current.children[folderName];
        }

        // Add file to the final folder
        const fileName = parts[parts.length - 1];
        current.files.push({
            type: 'file',
            name: fileName,
            index: index,
            size: file.size
        });
    });

    return root;
}

// Count total JSON files in a folder (recursive)
function countFilesInFolder(folder) {
    let count = folder.files.length;
    for (const child of Object.values(folder.children)) {
        count += countFilesInFolder(child);
    }
    return count;
}

// Render tree structure
function renderTree(folder, container, depth = 0) {
    // Sort folders and files
    const folderNames = Object.keys(folder.children).sort();

    // Render folders
    folderNames.forEach(folderName => {
        const child = folder.children[folderName];
        const fileCount = countFilesInFolder(child);

        // Create folder element
        const folderDiv = document.createElement('div');
        folderDiv.className = 'tree-item';

        const folderHeader = document.createElement('div');
        folderHeader.className = 'tree-folder';
        folderHeader.innerHTML = `
            <span class="tree-folder-icon">▶</span>
            <span class="tree-folder-name">${folderName}</span>
            <span class="tree-folder-count">${fileCount} file${fileCount !== 1 ? 's' : ''}</span>
        `;

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        // Toggle expand/collapse
        folderHeader.onclick = () => {
            const icon = folderHeader.querySelector('.tree-folder-icon');
            const isExpanded = childrenContainer.classList.contains('expanded');

            if (isExpanded) {
                childrenContainer.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                childrenContainer.classList.add('expanded');
                icon.classList.add('expanded');
            }
        };

        // Recursively render children
        renderTree(child, childrenContainer, depth + 1);

        folderDiv.appendChild(folderHeader);
        folderDiv.appendChild(childrenContainer);
        container.appendChild(folderDiv);
    });

    // Render files in this folder
    folder.files.sort((a, b) => a.name.localeCompare(b.name));
    folder.files.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'tree-file';
        fileDiv.onclick = () => selectJsonFile(file.index);

        fileDiv.innerHTML = `
            <span class="tree-file-name">${file.name}</span>
            <span class="tree-file-size">${formatFileSize(file.size)}</span>
        `;

        container.appendChild(fileDiv);
    });
}

function loadJsonFileList() {
    const listContainer = document.getElementById('jsonFileList');
    listContainer.innerHTML = '';

    // Build and render tree
    const tree = buildFileTree();
    renderTree(tree, listContainer);
}

function selectJsonFile(index) {
    const file = jsonFiles[index];
    currentEditingFile = file;
    currentEditingPath = file.path;

    // Load content into editor
    document.getElementById('currentFileName').textContent = file.path;
    document.getElementById('jsonEditor').value = file.content;
    document.getElementById('validationError').style.display = 'none';

    // Enable tab 3
    const tab2 = document.getElementById('workflow-tab-2');
    tab2.classList.add('enabled');

    // Switch to editor tab
    switchWorkflowTab(2);
}

function backToFileList() {
    switchWorkflowTab(1);
}

function formatJson() {
    const editor = document.getElementById('jsonEditor');
    const errorDiv = document.getElementById('validationError');

    try {
        const parsed = JSON.parse(editor.value);
        editor.value = JSON.stringify(parsed, null, 2);
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.textContent = `Invalid JSON: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}

async function saveModifiedMcAddon() {
    const editor = document.getElementById('jsonEditor');
    const errorDiv = document.getElementById('validationError');

    // Validate JSON
    try {
        JSON.parse(editor.value);
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.textContent = `Cannot save: Invalid JSON - ${error.message}`;
        errorDiv.style.display = 'block';
        return;
    }

    try {
        // Update the file in the ZIP
        editorZip.file(currentEditingPath, editor.value);

        // Generate new ZIP
        const newZipBlob = await editorZip.generateAsync({ type: 'blob' });

        // Create filename
        const baseName = editorMcAddonFile.name.replace(/\.mcaddon$/i, '');
        const outputFileName = `${baseName}_edited.mcaddon`;

        // Download
        downloadBlob(newZipBlob, outputFileName);

        // Show success message
        showSuccess('mcaddon-result', `Modified MCADDON file "${outputFileName}" has been downloaded.`);

        // Update the current file content in our cache
        const fileIndex = jsonFiles.findIndex(f => f.path === currentEditingPath);
        if (fileIndex !== -1) {
            jsonFiles[fileIndex].content = editor.value;
            jsonFiles[fileIndex].size = editor.value.length;
        }

        // Go back to file list
        setTimeout(() => {
            backToFileList();
        }, 1500);

    } catch (error) {
        errorDiv.textContent = `Error saving: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}

// ========== COMBINE MCADDON FUNCTIONS ==========

/**
 * Deep merge JSON objects/arrays from source into destination
 * - For objects: recursively merge keys
 * - For arrays: append unique items from source (unless mergeArrays is false)
 * - For primitives: keep destination value (collision)
 *
 * @param {*} dest - Destination value
 * @param {*} source - Source value
 * @param {boolean} mergeArrays - If false, treat arrays as collisions (keep dest)
 */
function deepMergeJson(dest, source, mergeArrays = true) {
    // If source is not an object/array, or dest is not the same type, return dest (collision)
    if (source === null || typeof source !== 'object') {
        return dest;
    }

    if (dest === null || typeof dest !== 'object') {
        return dest;
    }

    // Handle arrays
    if (Array.isArray(source) && Array.isArray(dest)) {
        if (mergeArrays) {
            return mergeArraysUnique(dest, source);
        } else {
            // Don't merge arrays - keep destination (collision)
            return dest;
        }
    }

    // Handle objects
    if (!Array.isArray(source) && !Array.isArray(dest)) {
        const result = { ...dest };
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (result.hasOwnProperty(key)) {
                    // Key exists in both - recursively merge
                    result[key] = deepMergeJson(result[key], source[key], mergeArrays);
                } else {
                    // Key only in source - add it
                    result[key] = source[key];
                }
            }
        }
        return result;
    }

    // Type mismatch - keep destination
    return dest;
}

/**
 * Merge arrays by appending unique items from source
 */
function mergeArraysUnique(destArray, sourceArray) {
    const result = [...destArray];

    for (const sourceItem of sourceArray) {
        // Check if item already exists in destination
        const exists = result.some(destItem =>
            JSON.stringify(destItem) === JSON.stringify(sourceItem)
        );

        if (!exists) {
            result.push(sourceItem);
        }
    }

    return result;
}

/**
 * Handle file selection for combine feature
 */
function handleCombineFileSelect(type) {
    // Hide previous results
    hideStatus('combineResult');
    toggleDownloadButton('downloadCombinedBtn', false);

    if (type === 'source') {
        const file = getSelectedFile('combineSourceFile');
        if (file) {
            combineSourceFile = file;
            updateFileInfo('combineSourceInfo', file);
        }
    } else {
        const file = getSelectedFile('combineDestFile');
        if (file) {
            combineDestFile = file;
            updateFileInfo('combineDestInfo', file);
        }
    }

    // Validate that both files are selected and different
    if (combineSourceFile && combineDestFile) {
        if (combineSourceFile.name === combineDestFile.name &&
            combineSourceFile.size === combineDestFile.size &&
            combineSourceFile.lastModified === combineDestFile.lastModified) {
            // Same file selected
            enableButton('combineBtn', false);
            showError('combineResult', 'Source and destination cannot be the same file. Please select different files.');
        } else {
            enableButton('combineBtn', true);
        }
    } else {
        enableButton('combineBtn', false);
    }
}

/**
 * Validate and find Behavior and Resources folders in an MCADDON file
 * Returns: { behaviorFolder: string, resourcesFolder: string } or throws error
 */
function validateAndFindMcAddonStructure(zip, fileName) {
    const results = validateMcAddonStructure(zip, fileName, {
        throwOnError: true,
        extraFoldersAsError: true
    });

    return {
        behaviorFolder: results.behaviorFolder,
        resourcesFolder: results.resourcesFolder
    };
}

/**
 * Merge files from source section into destination section
 */
async function mergeSectionFiles(sourceZip, destZip, sourceSectionPath, destSectionPath, combinedZip) {
    let filesAdded = 0;
    let filesMerged = 0;
    let filesSkipped = 0;

    // Process each file in source section
    for (const [sourcePath, sourceEntry] of Object.entries(sourceZip.files)) {
        if (sourceEntry.dir) continue;

        // Check if this file is within the source section
        if (!sourcePath.startsWith(sourceSectionPath + '/')) continue;

        // Get relative path within section
        const relativePath = sourcePath.substring(sourceSectionPath.length + 1);

        // Construct destination path
        const destPath = destSectionPath + '/' + relativePath;

        const destEntry = destZip.files[destPath];

        if (!destEntry) {
            // File doesn't exist in destination - copy it
            const content = await sourceEntry.async('arraybuffer');
            combinedZip.file(destPath, content);
            filesAdded++;
        } else {
            // File exists in both
            if (sourcePath.toLowerCase().endsWith('.json')) {
                // JSON file - merge content
                try {
                    const sourceContent = await sourceEntry.async('string');
                    const destContent = await destEntry.async('string');

                    const sourceJson = JSON.parse(sourceContent);
                    const destJson = JSON.parse(destContent);

                    // Check if this is manifest.json - don't merge arrays for manifest files
                    const isManifest = relativePath.toLowerCase().endsWith('manifest.json');
                    const mergedJson = deepMergeJson(destJson, sourceJson, !isManifest);

                    combinedZip.file(destPath, JSON.stringify(mergedJson, null, 2));
                    filesMerged++;
                } catch (e) {
                    // Not valid JSON or merge failed - skip
                    filesSkipped++;
                }
            } else if (sourcePath.toLowerCase().endsWith('.lang')) {
                // .lang file - merge by appending source content to destination
                try {
                    const sourceContent = await sourceEntry.async('string');
                    const destContent = await destEntry.async('string');

                    // Merge .lang files by combining their lines
                    // Parse both files into key-value maps to avoid duplicates
                    const destLines = destContent.split('\n');
                    const sourceLines = sourceContent.split('\n');

                    const translations = new Map();

                    // Add all destination translations first
                    for (const line of destLines) {
                        const trimmed = line.trim();
                        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                            const key = trimmed.substring(0, trimmed.indexOf('='));
                            translations.set(key, trimmed);
                        }
                    }

                    // Add/overwrite with source translations
                    for (const line of sourceLines) {
                        const trimmed = line.trim();
                        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                            const key = trimmed.substring(0, trimmed.indexOf('='));
                            translations.set(key, trimmed);
                        }
                    }

                    // Combine into final content
                    const mergedContent = Array.from(translations.values()).join('\n');

                    combinedZip.file(destPath, mergedContent);
                    filesMerged++;
                } catch (e) {
                    // Merge failed - skip
                    filesSkipped++;
                }
            } else {
                // Other non-JSON file - skip (keep destination)
                filesSkipped++;
            }
        }
    }

    return { filesAdded, filesMerged, filesSkipped };
}

/**
 * Combine two MCADDON files
 */
async function combineMcAddonFiles() {
    if (!combineSourceFile || !combineDestFile) {
        return;
    }

    const resultDiv = document.getElementById('combineResult');
    const downloadBtn = document.getElementById('downloadCombinedBtn');

    try {
        showLoading('combineResult', 'Loading and validating MCADDON files...');

        // Load both MCADDON files
        const sourceZip = await loadMcAddonZip(combineSourceFile);
        const destZip = await loadMcAddonZip(combineDestFile);

        // Validate structure of both files
        const sourceStructure = validateAndFindMcAddonStructure(sourceZip, combineSourceFile.name);
        const destStructure = validateAndFindMcAddonStructure(destZip, combineDestFile.name);

        showLoading('combineResult', 'Merging Behavior and Resources sections...');

        // Create a new zip based on destination
        combinedZip = destZip;

        // Merge Behavior section
        const behaviorStats = await mergeSectionFiles(
            sourceZip,
            destZip,
            sourceStructure.behaviorFolder,
            destStructure.behaviorFolder,
            combinedZip
        );

        // Merge Resources section
        const resourcesStats = await mergeSectionFiles(
            sourceZip,
            destZip,
            sourceStructure.resourcesFolder,
            destStructure.resourcesFolder,
            combinedZip
        );

        // Calculate totals
        const totalAdded = behaviorStats.filesAdded + resourcesStats.filesAdded;
        const totalMerged = behaviorStats.filesMerged + resourcesStats.filesMerged;
        const totalSkipped = behaviorStats.filesSkipped + resourcesStats.filesSkipped;

        // Show success message
        const message = `
            Combined MCADDON file ready for download.<br>
            <strong>Summary:</strong><br>
            - ${totalAdded} file(s) added from source<br>
            - ${totalMerged} JSON file(s) merged<br>
            - ${totalSkipped} file(s) skipped (collisions)<br><br>
            <strong>Behavior:</strong> ${behaviorStats.filesAdded} added, ${behaviorStats.filesMerged} merged, ${behaviorStats.filesSkipped} skipped<br>
            <strong>Resources:</strong> ${resourcesStats.filesAdded} added, ${resourcesStats.filesMerged} merged, ${resourcesStats.filesSkipped} skipped
        `;
        showSuccess('combineResult', message);

        // Show download button
        toggleDownloadButton('downloadCombinedBtn', true);

    } catch (error) {
        showError('combineResult', error.message);
        toggleDownloadButton('downloadCombinedBtn', false);
        combinedZip = null; // Clear any partial data
    }
}

/**
 * Download the combined MCADDON file
 */
async function downloadCombinedMcAddon() {
    if (!combinedZip) return;

    try {
        await downloadMcAddon(combinedZip, combineDestFile.name, '_combined', 'combineResult');
    } catch (error) {
        showError('combineResult', `Failed to download: ${error.message}`);
    }
}

// ========== DIFF MCADDON FUNCTIONS ==========

/**
 * Handle file selection for diff feature
 */
function handleDiffFileSelect(type) {
    const diffDisplay = document.getElementById('diffDisplay');

    // Hide previous results
    hideStatus('diffResult');
    diffDisplay.style.display = 'none';

    if (type === 'file1') {
        const file = getSelectedFile('diffFile1');
        if (file) {
            diffFile1 = file;
            updateFileInfo('diffFile1Info', file);
        }
    } else {
        const file = getSelectedFile('diffFile2');
        if (file) {
            diffFile2 = file;
            updateFileInfo('diffFile2Info', file);
        }
    }

    // Enable button if both files are selected
    enableButton('diffBtn', !!(diffFile1 && diffFile2));
}

/**
 * Compare two MCADDON files
 */
async function diffMcAddonFiles() {
    if (!diffFile1 || !diffFile2) return;

    const resultDiv = document.getElementById('diffResult');
    const diffDisplay = document.getElementById('diffDisplay');

    try {
        showLoading('diffResult', 'Loading MCADDON files...');

        // Load both MCADDON files
        diffFile1Zip = await loadMcAddonZip(diffFile1);
        diffFile2Zip = await loadMcAddonZip(diffFile2);

        showLoading('diffResult', 'Extracting and comparing JSON files...');

        // Extract JSON files from both and convert to object format
        const file1Array = await extractJsonFiles(diffFile1Zip);
        const file2Array = await extractJsonFiles(diffFile2Zip);

        const file1Json = {};
        const file2Json = {};

        file1Array.forEach(f => {
            file1Json[f.path] = { content: f.content, parsed: f.parsed };
        });

        file2Array.forEach(f => {
            file2Json[f.path] = { content: f.content, parsed: f.parsed };
        });

        // Compare
        diffResults = {
            onlyInFile1: [],
            onlyInFile2: [],
            modified: []
        };

        // Find files only in file1 or modified
        for (const path in file1Json) {
            if (!file2Json[path]) {
                diffResults.onlyInFile1.push({
                    path: path,
                    content: file1Json[path].content,
                    parsed: file1Json[path].parsed
                });
            } else {
                // File exists in both - check if different
                const content1 = JSON.stringify(file1Json[path].parsed, null, 2);
                const content2 = JSON.stringify(file2Json[path].parsed, null, 2);

                if (content1 !== content2) {
                    diffResults.modified.push({
                        path: path,
                        content1: content1,
                        content2: content2,
                        parsed1: file1Json[path].parsed,
                        parsed2: file2Json[path].parsed
                    });
                }
            }
        }

        // Find files only in file2
        for (const path in file2Json) {
            if (!file1Json[path]) {
                diffResults.onlyInFile2.push({
                    path: path,
                    content: file2Json[path].content,
                    parsed: file2Json[path].parsed
                });
            }
        }

        // Display results
        displayDiffResults();

        const totalDiffs = diffResults.onlyInFile1.length + diffResults.onlyInFile2.length + diffResults.modified.length;
        showSuccess('diffResult', `Found ${totalDiffs} difference(s).`, 'Comparison Complete!');

        diffDisplay.style.display = 'block';

    } catch (error) {
        showError('diffResult', error.message);
        diffDisplay.style.display = 'none';
    }
}

/**
 * Display diff results in the UI
 */
function displayDiffResults() {
    const summaryDiv = document.getElementById('diffSummary');
    const onlyIn1Div = document.getElementById('diffOnlyInFile1');
    const onlyIn2Div = document.getElementById('diffOnlyInFile2');
    const modifiedDiv = document.getElementById('diffModified');

    // Summary
    summaryDiv.innerHTML = `
        <div class="diff-summary">
            <div class="diff-summary-title">Comparison Summary</div>
            <div class="diff-summary-stats">
                <div class="diff-stat">
                    <span class="diff-stat-value removed">${diffResults.onlyInFile1.length}</span>
                    <span class="diff-stat-label">Only in File 1</span>
                </div>
                <div class="diff-stat">
                    <span class="diff-stat-value added">${diffResults.onlyInFile2.length}</span>
                    <span class="diff-stat-label">Only in File 2</span>
                </div>
                <div class="diff-stat">
                    <span class="diff-stat-value modified">${diffResults.modified.length}</span>
                    <span class="diff-stat-label">Modified</span>
                </div>
            </div>
        </div>
    `;

    // Only in File 1
    if (diffResults.onlyInFile1.length > 0) {
        onlyIn1Div.innerHTML = createDiffSection(
            'only-in-1',
            'Only in File 1 (Removed)',
            diffResults.onlyInFile1,
            'removed'
        );
    } else {
        onlyIn1Div.innerHTML = '';
    }

    // Only in File 2
    if (diffResults.onlyInFile2.length > 0) {
        onlyIn2Div.innerHTML = createDiffSection(
            'only-in-2',
            'Only in File 2 (Added)',
            diffResults.onlyInFile2,
            'added'
        );
    } else {
        onlyIn2Div.innerHTML = '';
    }

    // Modified
    if (diffResults.modified.length > 0) {
        modifiedDiv.innerHTML = createDiffSection(
            'modified',
            'Modified Files',
            diffResults.modified,
            'modified'
        );
    } else {
        modifiedDiv.innerHTML = '';
    }
}

/**
 * Create a diff section HTML
 */
function createDiffSection(type, title, files, category) {
    const sectionId = `diff-section-${type}`;
    const contentId = `diff-content-${type}`;

    let html = `
        <div class="diff-section">
            <div class="diff-section-header ${type}" onclick="toggleDiffSection('${contentId}', '${sectionId}')">
                <span><span class="diff-toggle-icon" id="${sectionId}-icon">▶</span> ${title}</span>
                <span class="diff-section-count">${files.length} file${files.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="diff-section-content" id="${contentId}">
    `;

    files.forEach((file, index) => {
        const itemId = `diff-item-${type}-${index}`;
        const comparisonId = `diff-comparison-${type}-${index}`;

        html += `
            <div class="diff-file-item" onclick="toggleDiffComparison('${comparisonId}')">
                <div class="diff-file-path">${file.path}</div>
        `;

        if (category === 'modified') {
            html += `
                <div class="diff-file-preview">Click to view side-by-side comparison</div>
                <div class="diff-comparison" id="${comparisonId}">
                    <div class="diff-side-by-side">
                        <div class="diff-side">
                            <div class="diff-side-header">File 1 (${diffFile1.name})</div>
                            <div class="diff-side-content">
                                <pre class="diff-json-view">${escapeHtml(file.content1)}</pre>
                            </div>
                        </div>
                        <div class="diff-side">
                            <div class="diff-side-header">File 2 (${diffFile2.name})</div>
                            <div class="diff-side-content">
                                <pre class="diff-json-view">${escapeHtml(file.content2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const content = JSON.stringify(file.parsed, null, 2);
            const fileName = category === 'removed' ? diffFile1.name : diffFile2.name;
            html += `
                <div class="diff-file-preview">Click to view content</div>
                <div class="diff-comparison" id="${comparisonId}">
                    <div class="diff-side-by-side">
                        <div class="diff-side" style="grid-column: span 2;">
                            <div class="diff-side-header">${fileName}</div>
                            <div class="diff-side-content">
                                <pre class="diff-json-view">${escapeHtml(content)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Toggle diff section expansion
 */
function toggleDiffSection(contentId, sectionId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(`${sectionId}-icon`);

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
        icon.classList.add('expanded');
    }
}

/**
 * Toggle diff comparison display
 */
function toggleDiffComparison(comparisonId) {
    const comparison = document.getElementById(comparisonId);

    if (comparison.classList.contains('expanded')) {
        comparison.classList.remove('expanded');
    } else {
        comparison.classList.add('expanded');
    }
}

/**
 * Escape HTML for display
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== VALIDATE MCADDON FUNCTIONS ==========

// Validation state
let validateFile = null;
let validateZip = null;
let validationResults = {
    errors: [],
    warnings: [],
    passed: false
};

/**
 * Handle file selection for validation
 */
async function handleValidateFileSelect() {
    const file = getSelectedFile('validateFile');
    if (!file) return;

    validateFile = file;
    updateFileInfo('validateFileInfo', file);

    // Automatically start validation
    await validateMcAddonFile();
}

/**
 * Main validation function
 */
async function validateMcAddonFile() {
    if (!validateFile) return;

    const resultsDiv = document.getElementById('validationResults');
    const summaryDiv = document.getElementById('validationSummary');
    const errorsDiv = document.getElementById('validationErrors');
    const warningsDiv = document.getElementById('validationWarnings');

    // Reset results
    validationResults = {
        errors: [],
        warnings: [],
        passed: false
    };

    try {
        // Show loading state
        resultsDiv.style.display = 'block';
        summaryDiv.innerHTML = '<div class="validation-summary">Validating MCADDON file...</div>';
        errorsDiv.innerHTML = '';
        warningsDiv.innerHTML = '';

        // Load the ZIP file
        validateZip = await loadMcAddonZip(validateFile);

        // Run all validation checks
        await validateStructure();
        await validateManifests();
        await validateJsonFiles();
        await validateDisplayNames();
        await detectAnomalies();

        // Check if validation passed
        validationResults.passed = validationResults.errors.length === 0;

        // Display results
        displayValidationResults();

    } catch (error) {
        summaryDiv.innerHTML = `
            <div class="validation-summary fail">
                <span class="validation-summary-icon">✗</span>
                Critical Error: ${error.message}
            </div>
        `;
        errorsDiv.innerHTML = '';
        warningsDiv.innerHTML = '';
    }
}

/**
 * Validate MCADDON structure (mandatory check)
 */
async function validateStructure() {
    const results = validateMcAddonStructure(validateZip, validateFile.name, {
        throwOnError: false,
        extraFoldersAsError: false
    });

    // Add errors and warnings to validationResults
    validationResults.errors.push(...results.errors);
    validationResults.warnings.push(...results.warnings);
}

/**
 * Validate manifest.json files (mandatory check)
 */
async function validateManifests() {
    const manifests = [];

    // Find all manifest.json files
    for (const [path, entry] of Object.entries(validateZip.files)) {
        if (!entry.dir && path.toLowerCase().endsWith('manifest.json')) {
            manifests.push({ path, entry });
        }
    }

    if (manifests.length === 0) {
        validationResults.errors.push({
            title: 'No Manifest Files',
            details: 'No manifest.json files found in the package.',
            path: null
        });
        return;
    }

    let hasBehaviorManifest = false;
    let hasResourcesManifest = false;

    for (const { path, entry } of manifests) {
        try {
            const content = await entry.async('string');
            const manifest = JSON.parse(content);

            // Validate manifest structure
            if (!manifest.format_version) {
                validationResults.errors.push({
                    title: 'Missing format_version',
                    details: 'manifest.json is missing format_version field.',
                    path: path
                });
            }

            if (!manifest.header) {
                validationResults.errors.push({
                    title: 'Missing header',
                    details: 'manifest.json is missing header section.',
                    path: path
                });
            } else {
                // Check header fields
                if (!manifest.header.name) {
                    validationResults.errors.push({
                        title: 'Missing Pack Name',
                        details: 'manifest.json header is missing name field.',
                        path: path
                    });
                }

                if (!manifest.header.description) {
                    validationResults.warnings.push({
                        title: 'Missing Pack Description',
                        details: 'manifest.json header is missing description field.',
                        path: path
                    });
                }

                if (!manifest.header.uuid) {
                    validationResults.errors.push({
                        title: 'Missing Pack UUID',
                        details: 'manifest.json header is missing uuid field.',
                        path: path
                    });
                }

                if (!manifest.header.version) {
                    validationResults.errors.push({
                        title: 'Missing Pack Version',
                        details: 'manifest.json header is missing version field.',
                        path: path
                    });
                }
            }

            if (!manifest.modules || !Array.isArray(manifest.modules)) {
                validationResults.errors.push({
                    title: 'Missing modules',
                    details: 'manifest.json is missing modules array.',
                    path: path
                });
            } else {
                // Check module types
                const moduleTypes = manifest.modules.map(m => m.type);

                if (moduleTypes.includes('data')) {
                    hasBehaviorManifest = true;
                }

                if (moduleTypes.includes('resources')) {
                    hasResourcesManifest = true;
                }

                // Validate each module
                manifest.modules.forEach((module, idx) => {
                    if (!module.type) {
                        validationResults.errors.push({
                            title: 'Missing Module Type',
                            details: `Module ${idx} is missing type field.`,
                            path: path
                        });
                    }

                    if (!module.uuid) {
                        validationResults.errors.push({
                            title: 'Missing Module UUID',
                            details: `Module ${idx} (${module.type || 'unknown'}) is missing uuid field.`,
                            path: path
                        });
                    }

                    if (!module.version) {
                        validationResults.errors.push({
                            title: 'Missing Module Version',
                            details: `Module ${idx} (${module.type || 'unknown'}) is missing version field.`,
                            path: path
                        });
                    }
                });
            }

            // Check minimum version (Minecraft 1.20.0 or later recommended)
            if (manifest.format_version) {
                const version = parseFloat(manifest.format_version);
                if (version < 1.20) {
                    validationResults.warnings.push({
                        title: 'Old Format Version',
                        details: `Format version ${manifest.format_version} is older than 1.20.0. Consider updating.`,
                        path: path
                    });
                }
            }

        } catch (error) {
            validationResults.errors.push({
                title: 'Invalid Manifest JSON',
                details: `Failed to parse manifest.json: ${error.message}`,
                path: path
            });
        }
    }

    // Check that we have both types of manifests
    if (!hasBehaviorManifest) {
        validationResults.errors.push({
            title: 'No Behavior Pack Manifest',
            details: 'No manifest.json with "data" module type found.',
            path: null
        });
    }

    if (!hasResourcesManifest) {
        validationResults.errors.push({
            title: 'No Resources Pack Manifest',
            details: 'No manifest.json with "resources" module type found.',
            path: null
        });
    }
}

/**
 * Validate all JSON files for proper syntax and structure
 */
async function validateJsonFiles() {
    let jsonCount = 0;
    let invalidCount = 0;

    for (const [path, entry] of Object.entries(validateZip.files)) {
        if (!entry.dir && path.toLowerCase().endsWith('.json')) {
            jsonCount++;

            try {
                const content = await entry.async('string');
                const parsed = JSON.parse(content);

                // Validate specific file types
                if (path.toLowerCase().includes('/recipes/')) {
                    validateRecipeFile(path, parsed);
                } else if (path.toLowerCase().includes('/items/')) {
                    validateItemFile(path, parsed);
                } else if (path.toLowerCase().includes('/blocks/')) {
                    validateBlockFile(path, parsed);
                }

            } catch (error) {
                invalidCount++;
                validationResults.errors.push({
                    title: 'Invalid JSON',
                    details: `Failed to parse JSON file: ${error.message}`,
                    path: path
                });
            }
        }
    }

    if (jsonCount === 0) {
        validationResults.warnings.push({
            title: 'No JSON Files',
            details: 'No JSON files found in the package (besides manifests).',
            path: null
        });
    }
}

/**
 * Validate recipe file structure
 */
function validateRecipeFile(path, json) {
    if (!json.format_version) {
        validationResults.warnings.push({
            title: 'Missing format_version in Recipe',
            details: 'Recipe file is missing format_version field.',
            path: path
        });
    }

    if (!json['minecraft:recipe_shaped'] && !json['minecraft:recipe_shapeless']) {
        validationResults.errors.push({
            title: 'Invalid Recipe Type',
            details: 'Recipe file must contain either minecraft:recipe_shaped or minecraft:recipe_shapeless.',
            path: path
        });
    }
}

/**
 * Validate item file structure
 */
function validateItemFile(path, json) {
    if (!json.format_version) {
        validationResults.warnings.push({
            title: 'Missing format_version in Item',
            details: 'Item file is missing format_version field.',
            path: path
        });
    }

    if (!json['minecraft:item']) {
        validationResults.errors.push({
            title: 'Invalid Item Structure',
            details: 'Item file must contain minecraft:item object.',
            path: path
        });
    } else if (!json['minecraft:item'].description || !json['minecraft:item'].description.identifier) {
        validationResults.errors.push({
            title: 'Missing Item Identifier',
            details: 'Item is missing description.identifier field.',
            path: path
        });
    }
}

/**
 * Validate block file structure
 */
function validateBlockFile(path, json) {
    // Check for identifier only if minecraft:block exists
    if (json['minecraft:block'] && (!json['minecraft:block'].description || !json['minecraft:block'].description.identifier)) {
        validationResults.errors.push({
            title: 'Missing Block Identifier',
            details: 'Block is missing description.identifier field.',
            path: path
        });
    }
}

/**
 * Validate display names and localization
 */
async function validateDisplayNames() {
    // Find all .lang files
    const langFiles = [];
    const identifiers = new Set();

    // Extract identifiers from items and blocks
    for (const [path, entry] of Object.entries(validateZip.files)) {
        if (!entry.dir && path.toLowerCase().endsWith('.json')) {
            try {
                const content = await entry.async('string');
                const json = JSON.parse(content);

                // Extract item identifiers
                if (json['minecraft:item'] && json['minecraft:item'].description) {
                    const id = json['minecraft:item'].description.identifier;
                    if (id) identifiers.add(id);
                }

                // Extract block identifiers
                if (json['minecraft:block'] && json['minecraft:block'].description) {
                    const id = json['minecraft:block'].description.identifier;
                    if (id) identifiers.add(id);
                }
            } catch (e) {
                // Skip invalid JSON
            }
        }

        // Collect .lang files
        if (!entry.dir && path.toLowerCase().endsWith('.lang')) {
            const content = await entry.async('string');
            langFiles.push({ path, content });
        }
    }

    // Check if there are .lang files
    if (langFiles.length === 0 && identifiers.size > 0) {
        validationResults.warnings.push({
            title: 'No Localization Files',
            details: 'No .lang files found. Items and blocks will not have display names.',
            path: null
        });
    } else if (identifiers.size > 0) {
        // Parse all .lang files
        const translations = new Map();

        for (const { path, content } of langFiles) {
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const key = trimmed.substring(0, trimmed.indexOf('=')).trim();
                    translations.set(key, true);
                }
            }
        }

        // Check each identifier for localization
        const missingTranslations = [];
        for (const id of identifiers) {
            const expectedKey = `item.${id}.name`;
            const expectedKey2 = `tile.${id}.name`;

            if (!translations.has(expectedKey) && !translations.has(expectedKey2)) {
                missingTranslations.push(id);
            }
        }

        if (missingTranslations.length > 0) {
            validationResults.warnings.push({
                title: 'Missing Display Names',
                details: `${missingTranslations.length} item(s)/block(s) missing localization entries: ${missingTranslations.slice(0, 5).join(', ')}${missingTranslations.length > 5 ? '...' : ''}`,
                path: null
            });
        }
    }
}

/**
 * Detect anomalies and potential issues
 */
async function detectAnomalies() {
    // Check for empty folders
    const folders = new Set();
    const filesInFolders = new Set();

    for (const [path, entry] of Object.entries(validateZip.files)) {
        const parts = path.split('/').filter(p => p);

        if (parts.length > 1) {
            // Track all parent folders
            for (let i = 1; i < parts.length; i++) {
                const folderPath = parts.slice(0, i).join('/');
                folders.add(folderPath);

                if (!entry.dir) {
                    filesInFolders.add(folderPath);
                }
            }
        }
    }

    // Check for empty folders that should typically have content
    const importantFolders = ['recipes', 'items', 'blocks', 'texts', 'textures'];
    for (const folder of folders) {
        const folderName = folder.split('/').pop().toLowerCase();

        if (importantFolders.includes(folderName) && !filesInFolders.has(folder)) {
            validationResults.warnings.push({
                title: 'Empty Important Folder',
                details: `Folder appears to be empty but typically should contain files.`,
                path: folder
            });
        }
    }

    // Check for duplicate identifiers
    const identifierMap = new Map();

    for (const [path, entry] of Object.entries(validateZip.files)) {
        if (!entry.dir && path.toLowerCase().endsWith('.json')) {
            try {
                const content = await entry.async('string');
                const json = JSON.parse(content);

                let identifier = null;

                if (json['minecraft:item']) {
                    identifier = json['minecraft:item'].description?.identifier;
                } else if (json['minecraft:block']) {
                    identifier = json['minecraft:block'].description?.identifier;
                } else if (json['minecraft:recipe_shaped']) {
                    identifier = json['minecraft:recipe_shaped'].description?.identifier;
                } else if (json['minecraft:recipe_shapeless']) {
                    identifier = json['minecraft:recipe_shapeless'].description?.identifier;
                }

                if (identifier) {
                    if (identifierMap.has(identifier)) {
                        identifierMap.get(identifier).push(path);
                    } else {
                        identifierMap.set(identifier, [path]);
                    }
                }
            } catch (e) {
                // Skip invalid JSON
            }
        }
    }

    // Report duplicates
    for (const [id, paths] of identifierMap.entries()) {
        if (paths.length > 1) {
            validationResults.warnings.push({
                title: 'Duplicate Identifier',
                details: `Identifier "${id}" is defined in ${paths.length} files: ${paths.join(', ')}`,
                path: null
            });
        }
    }

    // Check file naming conventions
    for (const [path, entry] of Object.entries(validateZip.files)) {
        if (!entry.dir) {
            const fileName = path.split('/').pop();

            // Check for spaces in filenames (not recommended)
            if (fileName.includes(' ')) {
                validationResults.warnings.push({
                    title: 'Spaces in Filename',
                    details: 'Filenames with spaces may cause issues. Consider using underscores instead.',
                    path: path
                });
            }

            // Check for uppercase in filenames (not recommended)
            if (fileName !== fileName.toLowerCase() && !path.toLowerCase().endsWith('manifest.json')) {
                validationResults.warnings.push({
                    title: 'Uppercase in Filename',
                    details: 'Filenames should be lowercase for consistency.',
                    path: path
                });
            }
        }
    }
}

/**
 * Display validation results in the UI
 */
function displayValidationResults() {
    const summaryDiv = document.getElementById('validationSummary');
    const errorsDiv = document.getElementById('validationErrors');
    const warningsDiv = document.getElementById('validationWarnings');

    // Summary
    const errorCount = validationResults.errors.length;
    const warningCount = validationResults.warnings.length;
    const passClass = validationResults.passed ? 'pass' : 'fail';
    const passIcon = validationResults.passed ? '✓' : '✗';
    const passText = validationResults.passed
        ? 'MCADDON file is valid!'
        : 'MCADDON file has errors';

    summaryDiv.innerHTML = `
        <div class="validation-summary ${passClass}">
            <span class="validation-summary-icon">${passIcon}</span>
            ${passText}
        </div>
        <div class="validation-stats">
            <div class="validation-stat">
                <span class="validation-stat-value ${passClass}">${passIcon}</span>
                <span class="validation-stat-label">Validation ${validationResults.passed ? 'Passed' : 'Failed'}</span>
            </div>
            <div class="validation-stat">
                <span class="validation-stat-value errors">${errorCount}</span>
                <span class="validation-stat-label">Error${errorCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="validation-stat">
                <span class="validation-stat-value warnings">${warningCount}</span>
                <span class="validation-stat-label">Warning${warningCount !== 1 ? 's' : ''}</span>
            </div>
        </div>
    `;

    // Errors
    if (errorCount > 0) {
        let errorsHtml = '<div class="validation-section"><div class="validation-section-title errors">Errors</div>';

        for (const error of validationResults.errors) {
            errorsHtml += `
                <div class="validation-item error">
                    <div class="validation-item-icon">✗</div>
                    <div class="validation-item-content">
                        <div class="validation-item-title">${error.title}</div>
                        <div class="validation-item-details">${error.details}</div>
                        ${error.path ? `<div class="validation-item-path">${error.path}</div>` : ''}
                    </div>
                </div>
            `;
        }

        errorsHtml += '</div>';
        errorsDiv.innerHTML = errorsHtml;
    } else {
        errorsDiv.innerHTML = '';
    }

    // Warnings
    if (warningCount > 0) {
        let warningsHtml = '<div class="validation-section"><div class="validation-section-title warnings">Warnings</div>';

        for (const warning of validationResults.warnings) {
            warningsHtml += `
                <div class="validation-item warning">
                    <div class="validation-item-icon">⚠</div>
                    <div class="validation-item-content">
                        <div class="validation-item-title">${warning.title}</div>
                        <div class="validation-item-details">${warning.details}</div>
                        ${warning.path ? `<div class="validation-item-path">${warning.path}</div>` : ''}
                    </div>
                </div>
            `;
        }

        warningsHtml += '</div>';
        warningsDiv.innerHTML = warningsHtml;
    } else {
        warningsDiv.innerHTML = '';
    }
}

// ========== BUILTIN FEATURES FUNCTIONS ==========

// Initialize page components on load
window.addEventListener('DOMContentLoaded', function() {
    initializeBuiltinFeatures();
    initializeGrids();
});

function initializeBuiltinFeatures() {
    const featureList = document.getElementById('builtinFeatureList');
    featureList.innerHTML = '';

    builtinFeatures.forEach(feature => {
        const button = document.createElement('button');
        button.className = 'builtin-feature-btn';
        button.textContent = feature.name;
        button.onclick = () => selectBuiltinFeature(feature);
        featureList.appendChild(button);
    });
}

function selectBuiltinFeature(feature) {
    builtinSelectedFeature = feature;

    // Hide feature selector, show file selector
    document.getElementById('builtin-feature-selector').style.display = 'none';
    document.getElementById('builtin-file-selector').style.display = 'block';

    // Reset subsequent sections
    document.getElementById('builtin-item-selector').style.display = 'none';
    document.getElementById('builtin-feature-config').style.display = 'none';
    document.getElementById('downloadBuiltinBtn').style.display = 'none';

    // Reset state
    builtinMcAddonFile = null;
    builtinZip = null;
    builtinFilteredItems = [];
    builtinSelectedItem = null;
    builtinFoodEffects = [];
    builtinEffectCounter = 0;
}

async function handleBuiltinMcAddonSelect() {
    const file = getSelectedFile('builtinMcAddonFile');
    if (!file) return;

    builtinMcAddonFile = file;
    updateFileInfo('builtinFileInfo', file);

    try {
        // Load the ZIP file
        builtinZip = await loadMcAddonZip(file);

        // Apply filter function to find matching items
        builtinFilteredItems = await builtinSelectedFeature.filterFunction(builtinZip);

        if (builtinFilteredItems.length === 0) {
            alert(`No items found matching the filter for ${builtinSelectedFeature.name}`);
            return;
        }

        // Show item selector
        document.getElementById('builtin-item-selector').style.display = 'block';
        loadBuiltinItemList();

    } catch (error) {
        alert(`Error loading MCADDON file: ${error.message}`);
    }
}

function loadBuiltinItemList() {
    const itemList = document.getElementById('builtinItemList');
    itemList.innerHTML = '';

    builtinFilteredItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'builtin-item-btn';
        button.innerHTML = `
            <div class="builtin-item-name">${item.identifier}</div>
            <div class="builtin-item-path">${item.path}</div>
        `;
        button.onclick = () => selectBuiltinItem(item);
        itemList.appendChild(button);
    });
}

function selectBuiltinItem(item) {
    builtinSelectedItem = item;

    // Show feature configuration section
    document.getElementById('builtin-feature-config').style.display = 'block';

    // Show selected item info
    const itemInfo = document.getElementById('selectedItemInfo');
    itemInfo.innerHTML = `
        <h4>Selected Item</h4>
        <p><strong>Identifier:</strong> ${item.identifier}</p>
        <p><strong>Path:</strong> ${item.path}</p>
    `;

    // Show appropriate configuration UI based on feature
    if (builtinSelectedFeature.id === 'food_effects') {
        document.getElementById('foodEffectsContainer').style.display = 'block';
        // Reset food effects list
        builtinFoodEffects = [];
        builtinEffectCounter = 0;
        document.getElementById('foodEffectsList').innerHTML = '';
    }

    // Hide download button
    document.getElementById('downloadBuiltinBtn').style.display = 'none';
}

function addFoodEffect() {
    const effectId = builtinEffectCounter++;
    const effect = {
        id: effectId,
        tag: '',
        duration: '',
        intensity: ''
    };

    builtinFoodEffects.push(effect);
    renderFoodEffect(effect);
}

function renderFoodEffect(effect) {
    const effectsList = document.getElementById('foodEffectsList');

    const effectDiv = document.createElement('div');
    effectDiv.className = 'food-effect-item';
    effectDiv.id = `food-effect-${effect.id}`;
    effectDiv.innerHTML = `
        <div class="food-effect-header">
            <h4>Effect ${effect.id + 1}</h4>
            <button class="remove-effect-btn" onclick="removeFoodEffect(${effect.id})">- Remove</button>
        </div>
        <div class="food-effect-fields">
            <div class="effect-field">
                <label for="effect-tag-${effect.id}">Effect Tag</label>
                <input type="text" id="effect-tag-${effect.id}"
                       placeholder="e.g., regeneration, speed"
                       oninput="updateFoodEffect(${effect.id}, 'tag', this.value)">
                <div class="error-message" id="error-tag-${effect.id}"></div>
            </div>
            <div class="effect-field">
                <label for="effect-duration-${effect.id}">Duration (seconds)</label>
                <input type="number" id="effect-duration-${effect.id}"
                       placeholder="30"
                       oninput="updateFoodEffect(${effect.id}, 'duration', this.value)">
                <div class="error-message" id="error-duration-${effect.id}"></div>
            </div>
            <div class="effect-field">
                <label for="effect-intensity-${effect.id}">Intensity (1-255)</label>
                <input type="number" id="effect-intensity-${effect.id}"
                       placeholder="1"
                       min="1" max="255"
                       oninput="updateFoodEffect(${effect.id}, 'intensity', this.value)">
                <div class="error-message" id="error-intensity-${effect.id}"></div>
            </div>
        </div>
    `;

    effectsList.appendChild(effectDiv);
}

function removeFoodEffect(effectId) {
    const index = builtinFoodEffects.findIndex(e => e.id === effectId);
    if (index !== -1) {
        builtinFoodEffects.splice(index, 1);
    }

    const effectDiv = document.getElementById(`food-effect-${effectId}`);
    if (effectDiv) {
        effectDiv.remove();
    }
}

function updateFoodEffect(effectId, field, value) {
    const effect = builtinFoodEffects.find(e => e.id === effectId);
    if (effect) {
        effect[field] = value;
        validateFoodEffectField(effectId, field, value);
    }
}

function validateFoodEffectField(effectId, field, value) {
    const inputElement = document.getElementById(`effect-${field}-${effectId}`);
    const errorElement = document.getElementById(`error-${field}-${effectId}`);

    let isValid = true;
    let errorMessage = '';

    if (field === 'duration') {
        const duration = parseInt(value);
        if (value && (isNaN(duration) || duration <= 0)) {
            isValid = false;
            errorMessage = 'Must be a positive number';
        }
    } else if (field === 'intensity') {
        const intensity = parseInt(value);
        if (value && (isNaN(intensity) || intensity < 1 || intensity > 255)) {
            isValid = false;
            errorMessage = 'Must be between 1 and 255';
        }
    }

    if (isValid) {
        inputElement.classList.remove('error');
        errorElement.textContent = '';
    } else {
        inputElement.classList.add('error');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

function validateAllFoodEffects() {
    let allValid = true;

    // Check if there's at least one effect
    if (builtinFoodEffects.length === 0) {
        alert('Please add at least one food effect');
        return false;
    }

    // Validate each effect
    for (const effect of builtinFoodEffects) {
        // Validate tag
        if (!effect.tag || effect.tag.trim() === '') {
            alert(`Effect ${effect.id + 1}: Tag is required`);
            allValid = false;
            break;
        }

        // Validate duration
        const duration = parseInt(effect.duration);
        if (!effect.duration || isNaN(duration) || duration <= 0) {
            const isValid = validateFoodEffectField(effect.id, 'duration', effect.duration);
            if (!isValid) {
                alert(`Effect ${effect.id + 1}: Duration must be a positive number`);
                allValid = false;
                break;
            }
        }

        // Validate intensity
        const intensity = parseInt(effect.intensity);
        if (!effect.intensity || isNaN(intensity) || intensity < 1 || intensity > 255) {
            const isValid = validateFoodEffectField(effect.id, 'intensity', effect.intensity);
            if (!isValid) {
                alert(`Effect ${effect.id + 1}: Intensity must be between 1 and 255`);
                allValid = false;
                break;
            }
        }
    }

    return allValid;
}

async function submitBuiltinFeature() {
    if (!builtinSelectedItem) {
        alert('No item selected');
        return;
    }

    if (builtinSelectedFeature.id === 'food_effects') {
        if (!validateAllFoodEffects()) {
            return;
        }

        try {
            // Clone the zip for modification
            builtinModifiedZip = await JSZip.loadAsync(await builtinZip.generateAsync({ type: 'arraybuffer' }));

            // Get the item data
            const itemData = JSON.parse(builtinSelectedItem.content);

            // CRITICAL FIX: Convert to format_version 1.10 with split BP/RP files
            // Format 1.10 is the last version where food effects work (vanilla Enchanted Golden Apple approach)
            // This requires splitting the item into two files: one in BP (functional) and one in RP (visual)
            const conversionResult = convertToFormat1_10(itemData);
            const bpItemData = conversionResult.behaviorPackData;
            const rpItemData = conversionResult.resourcePackData;

            // Track changes for user notification
            const allWarnings = [];
            const allRemovedComponents = [];

            // Add conversion warnings
            if (conversionResult.warnings.length > 0) {
                allWarnings.push(...conversionResult.warnings);
            }

            if (conversionResult.removedComponents.length > 0) {
                allRemovedComponents.push(...conversionResult.removedComponents);
            }

            // Ensure the food component has an effects array
            if (!bpItemData['minecraft:item'].components['minecraft:food'].effects) {
                bpItemData['minecraft:item'].components['minecraft:food'].effects = [];
            }

            // Add new effects (append to existing)
            for (const effect of builtinFoodEffects) {
                // Add "minecraft:" prefix if not present
                let effectName = effect.tag.trim();
                if (!effectName.startsWith('minecraft:')) {
                    effectName = 'minecraft:' + effectName;
                }

                const effectObj = {
                    name: effectName,
                    duration: parseInt(effect.duration) * 20,  // Convert seconds to ticks (20 ticks = 1 second)
                    amplifier: parseInt(effect.intensity) - 1  // Minecraft uses 0-based amplifier
                };
                bpItemData['minecraft:item'].components['minecraft:food'].effects.push(effectObj);
            }

            // Update the behavior pack item JSON in the zip
            const updatedBpJson = JSON.stringify(bpItemData, null, 2);
            builtinModifiedZip.file(builtinSelectedItem.path, updatedBpJson);

            // Find or create the corresponding resource pack item file
            // In format version 1.10, items MUST be split between BP and RP
            const itemIdentifier = bpItemData['minecraft:item'].description?.identifier;
            if (itemIdentifier) {
                const resourcesPack = await findResourcesPack(builtinModifiedZip);
                if (resourcesPack) {
                    // Search for existing resource pack item file
                    let rpItemPath = await findResourcePackItemFile(builtinModifiedZip, resourcesPack, itemIdentifier);

                    if (!rpItemPath) {
                        // Create new RP item file if it doesn't exist
                        // Extract filename from BP path
                        const bpFilename = builtinSelectedItem.path.split('/').pop();
                        rpItemPath = `${resourcesPack}/items/${bpFilename}`;
                        allWarnings.push('Created new resource pack item file (required for format 1.10)');
                    }

                    try {
                        // Write the resource pack item to the zip
                        const updatedRpJson = JSON.stringify(rpItemData, null, 2);
                        builtinModifiedZip.file(rpItemPath, updatedRpJson);
                        allWarnings.push('Updated both BP and RP item files (format 1.10 requires split files)');
                    } catch (e) {
                        console.warn('Could not create/update resource pack item:', e);
                        allWarnings.push('Warning: Could not create/update resource pack file');
                    }
                } else {
                    allWarnings.push('Warning: No resource pack found - RP item file not created');
                }
            }

            // Show download button
            document.getElementById('downloadBuiltinBtn').style.display = 'block';

            // Build comprehensive user notification
            let message = 'Food effects applied successfully!\n\n';

            if (allRemovedComponents.length > 0) {
                message += '⚠️ REMOVED INCOMPATIBLE COMPONENTS:\n';
                allRemovedComponents.forEach(comp => {
                    message += `  • ${comp}\n`;
                });
                message += '\n';
            }

            if (allWarnings.length > 0) {
                message += '📋 CHANGES MADE:\n';
                allWarnings.forEach(warning => {
                    message += `  • ${warning}\n`;
                });
                message += '\n';
            }

            message += 'Click Download to save the modified MCADDON file.';

            alert(message);

        } catch (error) {
            alert(`Error applying food effects: ${error.message}`);
        }
    }
}

async function downloadBuiltinMcAddon() {
    if (!builtinModifiedZip) {
        alert('No modified file to download');
        return;
    }

    try {
        await downloadMcAddon(builtinModifiedZip, builtinMcAddonFile.name, '_modified');
    } catch (error) {
        alert(`Error generating download: ${error.message}`);
    }
}

// ========== PNG Editor Functions ==========

async function handlePngMcAddonSelect() {
    const fileInput = document.getElementById('pngMcAddonFile');
    const fileInfo = document.getElementById('pngFileInfo');
    const file = fileInput.files[0];

    if (!file) return;

    try {
        pngMcAddonFile = file;
        const data = await readFileAsArrayBuffer(file);
        pngZip = await JSZip.loadAsync(data);

        // Extract all PNG files
        pngFiles = [];
        for (const [path, zipEntry] of Object.entries(pngZip.files)) {
            if (!zipEntry.dir && path.toLowerCase().endsWith('.png')) {
                pngFiles.push({
                    path: path,
                    size: zipEntry._data ? zipEntry._data.uncompressedSize : 0,
                    zipEntry: zipEntry
                });
            }
        }

        fileInfo.innerHTML = `<p style="color: #27ae60;">✓ Loaded ${file.name} (${formatFileSize(file.size)}) - Found ${pngFiles.length} PNG file${pngFiles.length !== 1 ? 's' : ''}</p>`;

        // Show operation selector
        document.getElementById('png-operation-selector').style.display = 'block';

        // Reset state
        pngCurrentOperation = null;
        pngSelectedPath = null;
        pngLocalFile = null;
        pngLocalFileData = null;
        pngModifiedZip = null;

        // Hide all operation sections
        document.getElementById('png-delete-section').style.display = 'none';
        document.getElementById('png-add-section').style.display = 'none';
        document.getElementById('png-replace-section').style.display = 'none';
        document.getElementById('png-download-section').style.display = 'none';
        document.getElementById('downloadModifiedMcAddonBtn').style.display = 'none';

    } catch (error) {
        fileInfo.innerHTML = `<p style="color: #e74c3c;">Error loading file: ${error.message}</p>`;
    }
}

function selectPngOperation(operation) {
    pngCurrentOperation = operation;

    // Hide operation selector
    document.getElementById('png-operation-selector').style.display = 'none';

    // Hide all operation sections
    document.getElementById('png-delete-section').style.display = 'none';
    document.getElementById('png-add-section').style.display = 'none';
    document.getElementById('png-replace-section').style.display = 'none';
    document.getElementById('png-download-section').style.display = 'none';

    // Show the relevant section and build tree
    if (operation === 'delete') {
        document.getElementById('png-delete-section').style.display = 'block';
        buildPngTreeForDelete();
    } else if (operation === 'add') {
        document.getElementById('png-add-section').style.display = 'block';
    } else if (operation === 'replace') {
        document.getElementById('png-replace-section').style.display = 'block';
    } else if (operation === 'download') {
        document.getElementById('png-download-section').style.display = 'block';
        buildPngTreeForDownload();
    }
}

function buildPngFileTree() {
    const root = { type: 'folder', name: '', children: {}, files: [] };

    pngFiles.forEach((file, index) => {
        const parts = file.path.split('/');
        let current = root;

        // Navigate/create folder structure
        for (let i = 0; i < parts.length - 1; i++) {
            const folderName = parts[i];
            if (!current.children[folderName]) {
                current.children[folderName] = {
                    type: 'folder',
                    name: folderName,
                    children: {},
                    files: [],
                    path: parts.slice(0, i + 1).join('/')
                };
            }
            current = current.children[folderName];
        }

        // Add file to the final folder
        const fileName = parts[parts.length - 1];
        current.files.push({
            type: 'file',
            name: fileName,
            index: index,
            size: file.size,
            path: file.path
        });
    });

    return root;
}

function countPngFilesInFolder(folder) {
    let count = folder.files.length;
    for (const child of Object.values(folder.children)) {
        count += countPngFilesInFolder(child);
    }
    return count;
}

function renderPngTree(folder, container, depth = 0, clickHandler = null, showFiles = true, allowFolderClick = false) {
    const folderNames = Object.keys(folder.children).sort();

    // Render folders
    folderNames.forEach(folderName => {
        const child = folder.children[folderName];
        const fileCount = countPngFilesInFolder(child);

        const folderDiv = document.createElement('div');
        folderDiv.className = 'tree-item';

        const folderHeader = document.createElement('div');
        if (allowFolderClick) {
            folderHeader.className = 'tree-folder png-folder-selectable';
        } else {
            folderHeader.className = 'tree-folder';
        }

        folderHeader.innerHTML = `
            <span class="tree-folder-icon">▶</span>
            <span class="tree-folder-name">${folderName}</span>
            <span class="tree-folder-count">${fileCount} PNG${fileCount !== 1 ? 's' : ''}</span>
        `;

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        // Toggle expand/collapse and handle folder clicks
        folderHeader.onclick = (e) => {
            if (allowFolderClick && clickHandler) {
                clickHandler(child.path || folderName, true);
            } else {
                const icon = folderHeader.querySelector('.tree-folder-icon');
                const isExpanded = childrenContainer.classList.contains('expanded');

                if (isExpanded) {
                    childrenContainer.classList.remove('expanded');
                    icon.classList.remove('expanded');
                } else {
                    childrenContainer.classList.add('expanded');
                    icon.classList.add('expanded');
                }
            }
        };

        // Recursively render children
        renderPngTree(child, childrenContainer, depth + 1, clickHandler, showFiles, allowFolderClick);

        folderDiv.appendChild(folderHeader);
        folderDiv.appendChild(childrenContainer);
        container.appendChild(folderDiv);
    });

    // Render files in this folder (if showFiles is true)
    if (showFiles) {
        folder.files.sort((a, b) => a.name.localeCompare(b.name));
        folder.files.forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'tree-file';

            if (clickHandler) {
                fileDiv.onclick = () => clickHandler(file.path, false);
            }

            fileDiv.innerHTML = `
                <span class="tree-file-name">${file.name}</span>
                <span class="tree-file-size">${formatFileSize(file.size)}</span>
            `;

            container.appendChild(fileDiv);
        });
    }
}

// ========== Delete PNG Functions ==========

function buildPngTreeForDelete() {
    const listContainer = document.getElementById('pngDeleteList');
    listContainer.innerHTML = '';

    document.getElementById('deleteConfirmSection').style.display = 'none';

    const tree = buildPngFileTree();
    renderPngTree(tree, listContainer, 0, selectPngForDelete, true, false);
}

function selectPngForDelete(path, isFolder) {
    if (isFolder) return; // Only files can be selected for deletion

    pngSelectedPath = path;
    document.getElementById('deleteSelectedPath').textContent = path;
    document.getElementById('deleteConfirmSection').style.display = 'block';
}

async function confirmDeletePng() {
    if (!pngSelectedPath) {
        alert('No file selected');
        return;
    }

    try {
        // Create a copy of the ZIP
        pngModifiedZip = await JSZip.loadAsync(await pngZip.generateAsync({ type: 'arraybuffer' }));

        // Remove the file
        pngModifiedZip.remove(pngSelectedPath);

        // Show download button
        document.getElementById('downloadModifiedMcAddonBtn').style.display = 'block';

        // Hide the delete section
        document.getElementById('png-delete-section').style.display = 'none';

        alert(`File deleted: ${pngSelectedPath}\n\nClick "Download Modified MCADDON" to save your changes.`);

    } catch (error) {
        alert(`Error deleting file: ${error.message}`);
    }
}

// ========== Add PNG Functions ==========

async function handleAddPngLocalSelect() {
    const fileInput = document.getElementById('addPngLocalFile');
    const fileInfo = document.getElementById('addPngLocalInfo');
    const file = fileInput.files[0];

    if (!file) return;

    try {
        pngLocalFile = file;
        pngLocalFileData = await readFileAsArrayBuffer(file);

        fileInfo.innerHTML = `<p style="color: #27ae60;">✓ Selected ${file.name} (${formatFileSize(file.size)})</p>`;

        // Show folder browser
        document.getElementById('addPngBrowserSection').style.display = 'block';
        buildPngTreeForAdd();

    } catch (error) {
        fileInfo.innerHTML = `<p style="color: #e74c3c;">Error loading file: ${error.message}</p>`;
    }
}

function buildPngTreeForAdd() {
    const listContainer = document.getElementById('pngAddFolderList');
    listContainer.innerHTML = '';

    document.getElementById('addConfirmSection').style.display = 'none';

    const tree = buildPngFileTree();
    renderPngTree(tree, listContainer, 0, selectFolderForAdd, false, true);
}

function selectFolderForAdd(path, isFolder) {
    pngSelectedPath = path || '';
    document.getElementById('addSelectedPath').textContent = path || '(root)';
    document.getElementById('addConfirmSection').style.display = 'block';
}

async function confirmAddPng() {
    if (!pngLocalFile || !pngLocalFileData) {
        alert('No local file selected');
        return;
    }

    try {
        // Create a copy of the ZIP
        pngModifiedZip = await JSZip.loadAsync(await pngZip.generateAsync({ type: 'arraybuffer' }));

        // Add the new file
        const targetPath = pngSelectedPath ? `${pngSelectedPath}/${pngLocalFile.name}` : pngLocalFile.name;
        pngModifiedZip.file(targetPath, pngLocalFileData);

        // Show download button
        document.getElementById('downloadModifiedMcAddonBtn').style.display = 'block';

        // Hide the add section
        document.getElementById('png-add-section').style.display = 'none';

        alert(`File added: ${targetPath}\n\nClick "Download Modified MCADDON" to save your changes.`);

    } catch (error) {
        alert(`Error adding file: ${error.message}`);
    }
}

// ========== Replace PNG Functions ==========

async function handleReplacePngLocalSelect() {
    const fileInput = document.getElementById('replacePngLocalFile');
    const fileInfo = document.getElementById('replacePngLocalInfo');
    const file = fileInput.files[0];

    if (!file) return;

    try {
        pngLocalFile = file;
        pngLocalFileData = await readFileAsArrayBuffer(file);

        fileInfo.innerHTML = `<p style="color: #27ae60;">✓ Selected ${file.name} (${formatFileSize(file.size)})</p>`;

        // Show PNG browser
        document.getElementById('replacePngBrowserSection').style.display = 'block';
        buildPngTreeForReplace();

    } catch (error) {
        fileInfo.innerHTML = `<p style="color: #e74c3c;">Error loading file: ${error.message}</p>`;
    }
}

function buildPngTreeForReplace() {
    const listContainer = document.getElementById('pngReplaceList');
    listContainer.innerHTML = '';

    document.getElementById('replaceConfirmSection').style.display = 'none';

    const tree = buildPngFileTree();
    renderPngTree(tree, listContainer, 0, selectPngForReplace, true, false);
}

function selectPngForReplace(path, isFolder) {
    if (isFolder) return; // Only files can be selected for replacement

    pngSelectedPath = path;
    document.getElementById('replaceSelectedPath').textContent = path;
    document.getElementById('replaceConfirmSection').style.display = 'block';
}

async function confirmReplacePng() {
    if (!pngSelectedPath) {
        alert('No file selected to replace');
        return;
    }

    if (!pngLocalFile || !pngLocalFileData) {
        alert('No local file selected');
        return;
    }

    try {
        // Create a copy of the ZIP
        pngModifiedZip = await JSZip.loadAsync(await pngZip.generateAsync({ type: 'arraybuffer' }));

        // Replace the file (keep same path/name, new content)
        pngModifiedZip.file(pngSelectedPath, pngLocalFileData);

        // Show download button
        document.getElementById('downloadModifiedMcAddonBtn').style.display = 'block';

        // Hide the replace section
        document.getElementById('png-replace-section').style.display = 'none';

        alert(`File replaced: ${pngSelectedPath}\n\nClick "Download Modified MCADDON" to save your changes.`);

    } catch (error) {
        alert(`Error replacing file: ${error.message}`);
    }
}

// ========== Download PNG Functions ==========

function buildPngTreeForDownload() {
    const listContainer = document.getElementById('pngDownloadList');
    listContainer.innerHTML = '';

    document.getElementById('downloadPngConfirmSection').style.display = 'none';

    const tree = buildPngFileTree();
    renderPngTree(tree, listContainer, 0, selectPngForDownload, true, false);
}

function selectPngForDownload(path, isFolder) {
    if (isFolder) return; // Only files can be selected for download

    pngSelectedPath = path;
    document.getElementById('downloadSelectedPath').textContent = path;
    document.getElementById('downloadPngConfirmSection').style.display = 'block';
}

async function confirmDownloadPng() {
    if (!pngSelectedPath) {
        alert('No file selected');
        return;
    }

    try {
        const zipEntry = pngZip.file(pngSelectedPath);
        if (!zipEntry) {
            alert('File not found in MCADDON');
            return;
        }

        const content = await zipEntry.async('blob');
        const fileName = pngSelectedPath.split('/').pop();
        downloadBlob(content, fileName);

        alert(`PNG file downloaded: ${fileName}`);

    } catch (error) {
        alert(`Error downloading file: ${error.message}`);
    }
}

// ========== Helper Functions ==========

function cancelPngOperation() {
    // Reset to operation selector
    pngSelectedPath = null;
    pngLocalFile = null;
    pngLocalFileData = null;

    // Hide all operation sections
    document.getElementById('png-delete-section').style.display = 'none';
    document.getElementById('png-add-section').style.display = 'none';
    document.getElementById('png-replace-section').style.display = 'none';
    document.getElementById('png-download-section').style.display = 'none';

    // Show operation selector
    document.getElementById('png-operation-selector').style.display = 'block';
}

async function downloadModifiedPngMcAddon() {
    if (!pngModifiedZip) {
        alert('No modified file to download');
        return;
    }

    try {
        const blob = await pngModifiedZip.generateAsync({ type: 'blob' });
        const originalName = pngMcAddonFile.name;
        const newName = originalName.replace('.mcaddon', '_modified.mcaddon');
        downloadBlob(blob, newName);

    } catch (error) {
        alert(`Error generating download: ${error.message}`);
    }
}

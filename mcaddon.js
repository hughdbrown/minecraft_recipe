/**
 * McAddon - Object-oriented interface for MCADDON file manipulation
 *
 * This class encapsulates all MCADDON file operations including:
 * - Loading and parsing MCADDON files
 * - Navigating pack structure (behavior pack, resource pack)
 * - Querying items, blocks, recipes
 * - Modifying content (immutable pattern - returns new instances)
 * - Export/download
 *
 * Usage:
 *   const mcaddon = await McAddon.fromFile(file);
 *   const items = await mcaddon.getItems();
 *   const modified = mcaddon.addFile('recipes/new.json', content);
 *   await modified.download('_modified');
 */
class McAddon {
    /**
     * Private constructor - use static factory methods
     * @private
     */
    constructor(zip, fileName = 'addon.mcaddon') {
        this._zip = zip;
        this._fileName = fileName;
        this._cache = {
            behaviorPack: null,
            resourcePack: null,
            items: null,
            blocks: null,
            recipes: null
        };
    }

    /**
     * Create McAddon from a File object
     * @param {File} file - The MCADDON file
     * @returns {Promise<McAddon>}
     */
    static async fromFile(file) {
        const data = await readFileAsArrayBuffer(file);
        const zip = await JSZip.loadAsync(data);
        return new McAddon(zip, file.name);
    }

    /**
     * Create McAddon from a JSZip instance
     * @param {JSZip} zip - The ZIP object
     * @param {string} fileName - Optional filename
     * @returns {McAddon}
     */
    static fromZip(zip, fileName = 'addon.mcaddon') {
        return new McAddon(zip, fileName);
    }

    /**
     * Get the underlying JSZip object (for advanced operations)
     * @returns {JSZip}
     */
    getZip() {
        return this._zip;
    }

    /**
     * Get the filename
     * @returns {string}
     */
    getFileName() {
        return this._fileName;
    }

    // ========== PACK STRUCTURE NAVIGATION ==========

    /**
     * Find and return the behavior pack folder path
     * @returns {Promise<string|null>}
     */
    async getBehaviorPack() {
        if (this._cache.behaviorPack !== null) {
            return this._cache.behaviorPack;
        }

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir && path.includes('manifest.json') === false) {continue;}

            const manifestPath = path.endsWith('/') ? path + 'manifest.json' : path;
            if (this._zip.files[manifestPath]) {
                try {
                    const manifestContent = await this._zip.files[manifestPath].async('string');
                    const manifest = JSON.parse(manifestContent);

                    if (manifest.modules) {
                        for (const module of manifest.modules) {
                            if (module.type === 'data') {
                                let behaviorPack = path.endsWith('/') ? path.slice(0, -1) : path.substring(0, path.lastIndexOf('/'));
                                if (behaviorPack === '') {behaviorPack = '.';}
                                this._cache.behaviorPack = behaviorPack;
                                return behaviorPack;
                            }
                        }
                    }
                } catch (e) {
                    // Not a valid manifest, continue
                }
            }
        }

        this._cache.behaviorPack = null;
        return null;
    }

    /**
     * Find and return the resource pack folder path
     * @returns {Promise<string|null>}
     */
    async getResourcePack() {
        if (this._cache.resourcePack !== null) {
            return this._cache.resourcePack;
        }

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir && path.includes('manifest.json') === false) {continue;}

            const manifestPath = path.endsWith('/') ? path + 'manifest.json' : path;
            if (this._zip.files[manifestPath]) {
                try {
                    const manifestContent = await this._zip.files[manifestPath].async('string');
                    const manifest = JSON.parse(manifestContent);

                    if (manifest.modules) {
                        for (const module of manifest.modules) {
                            if (module.type === 'resources') {
                                let resourcesPack = path.endsWith('/') ? path.slice(0, -1) : path.substring(0, path.lastIndexOf('/'));
                                if (resourcesPack === '') {resourcesPack = '.';}
                                this._cache.resourcePack = resourcesPack;
                                return resourcesPack;
                            }
                        }
                    }
                } catch (e) {
                    // Not a valid manifest, continue
                }
            }
        }

        this._cache.resourcePack = null;
        return null;
    }

    // ========== CONTENT QUERIES ==========

    /**
     * Get all items from the behavior pack
     * @returns {Promise<Array>} Array of {path, identifier, content, data}
     */
    async getItems() {
        if (this._cache.items !== null) {
            return this._cache.items;
        }

        const items = [];
        const behaviorPack = await this.getBehaviorPack();
        if (!behaviorPack) {
            this._cache.items = items;
            return items;
        }

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir) {continue;}
            if (!path.toLowerCase().includes('/items/')) {continue;}
            if (!path.toLowerCase().endsWith('.json')) {continue;}

            try {
                const content = await zipEntry.async('string');
                const itemData = JSON.parse(content);

                if (itemData['minecraft:item'] && itemData['minecraft:item'].description) {
                    const identifier = itemData['minecraft:item'].description.identifier;
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

        this._cache.items = items;
        return items;
    }

    /**
     * Get all blocks from the behavior pack
     * @returns {Promise<Array>} Array of {path, identifier, content, data}
     */
    async getBlocks() {
        if (this._cache.blocks !== null) {
            return this._cache.blocks;
        }

        const blocks = [];
        const behaviorPack = await this.getBehaviorPack();
        if (!behaviorPack) {
            this._cache.blocks = blocks;
            return blocks;
        }

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir) {continue;}
            if (!path.toLowerCase().includes('/blocks/')) {continue;}
            if (!path.toLowerCase().endsWith('.json')) {continue;}

            try {
                const content = await zipEntry.async('string');
                const blockData = JSON.parse(content);

                if (blockData['minecraft:block'] && blockData['minecraft:block'].description) {
                    const identifier = blockData['minecraft:block'].description.identifier;
                    blocks.push({
                        path: path,
                        identifier: identifier,
                        content: content,
                        data: blockData
                    });
                }
            } catch (e) {
                // Invalid JSON or structure, skip
            }
        }

        this._cache.blocks = blocks;
        return blocks;
    }

    /**
     * Get all recipes from the behavior pack
     * @returns {Promise<Array>} Array of {path, identifier, content, data}
     */
    async getRecipes() {
        if (this._cache.recipes !== null) {
            return this._cache.recipes;
        }

        const recipes = [];
        const behaviorPack = await this.getBehaviorPack();
        if (!behaviorPack) {
            this._cache.recipes = recipes;
            return recipes;
        }

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir) {continue;}
            if (!path.toLowerCase().includes('/recipes/')) {continue;}
            if (!path.toLowerCase().endsWith('.json')) {continue;}

            try {
                const content = await zipEntry.async('string');
                const recipeData = JSON.parse(content);

                let identifier = null;
                if (recipeData['minecraft:recipe_shaped']) {
                    identifier = recipeData['minecraft:recipe_shaped'].description?.identifier;
                } else if (recipeData['minecraft:recipe_shapeless']) {
                    identifier = recipeData['minecraft:recipe_shapeless'].description?.identifier;
                }

                if (identifier) {
                    recipes.push({
                        path: path,
                        identifier: identifier,
                        content: content,
                        data: recipeData
                    });
                }
            } catch (e) {
                // Invalid JSON or structure, skip
            }
        }

        this._cache.recipes = recipes;
        return recipes;
    }

    /**
     * Find an item by identifier
     * @param {string} identifier - The item identifier
     * @returns {Promise<Object|null>} The item or null
     */
    async findItem(identifier) {
        const items = await this.getItems();
        return items.find(item => item.identifier === identifier) || null;
    }

    /**
     * Find a block by identifier
     * @param {string} identifier - The block identifier
     * @returns {Promise<Object|null>} The block or null
     */
    async findBlock(identifier) {
        const blocks = await this.getBlocks();
        return blocks.find(block => block.identifier === identifier) || null;
    }

    /**
     * Find items matching a filter function
     * @param {Function} filterFn - Function that takes item and returns boolean
     * @returns {Promise<Array>}
     */
    async filterItems(filterFn) {
        const items = await this.getItems();
        return items.filter(filterFn);
    }

    /**
     * Get all JSON files
     * @param {Function} pathFilter - Optional path filter function
     * @returns {Promise<Array>} Array of {path, content, parsed}
     */
    async getJsonFiles(pathFilter = null) {
        const jsonFiles = [];

        for (const [path, entry] of Object.entries(this._zip.files)) {
            if (!entry.dir && path.toLowerCase().endsWith('.json')) {
                if (pathFilter && !pathFilter(path)) {continue;}

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
     * Find a resource pack item file by identifier
     * @param {string} identifier - The item identifier
     * @returns {Promise<string|null>} The path to the RP item file, or null
     */
    async findResourcePackItemFile(identifier) {
        const resourcesPack = await this.getResourcePack();
        if (!resourcesPack) {return null;}

        for (const [path, zipEntry] of Object.entries(this._zip.files)) {
            if (zipEntry.dir) {continue;}
            if (!path.toLowerCase().includes('/items/')) {continue;}
            if (!path.toLowerCase().endsWith('.json')) {continue;}
            if (!path.startsWith(resourcesPack)) {continue;}

            try {
                const content = await zipEntry.async('string');
                const itemData = JSON.parse(content);

                if (itemData['minecraft:item']?.description?.identifier === identifier) {
                    return path;
                }
            } catch (e) {
                // Invalid JSON or structure, skip
            }
        }
        return null;
    }

    // ========== MODIFICATION (IMMUTABLE) ==========

    /**
     * Add or update a file in the MCADDON (returns new instance)
     * @param {string} path - File path within the MCADDON
     * @param {string|ArrayBuffer} content - File content
     * @returns {McAddon} New McAddon instance
     */
    addFile(path, content) {
        const newZip = this._zip.clone();
        newZip.file(path, content);
        return new McAddon(newZip, this._fileName);
    }

    /**
     * Remove a file from the MCADDON (returns new instance)
     * @param {string} path - File path to remove
     * @returns {McAddon} New McAddon instance
     */
    removeFile(path) {
        const newZip = this._zip.clone();
        newZip.remove(path);
        return new McAddon(newZip, this._fileName);
    }

    /**
     * Add a recipe to the behavior pack
     * @param {string} fileName - Recipe filename (e.g., 'my_recipe.json')
     * @param {Object} recipeData - Recipe JSON object
     * @returns {Promise<McAddon>} New McAddon instance
     */
    async addRecipe(fileName, recipeData) {
        const behaviorPack = await this.getBehaviorPack();
        if (!behaviorPack) {
            throw new Error('Could not find behavior pack in MCADDON');
        }

        const recipesPath = this._constructPackPath(behaviorPack, 'recipes');
        const recipeFilePath = recipesPath + fileName;
        const jsonString = JSON.stringify(recipeData, null, 2);

        return this.addFile(recipeFilePath, jsonString);
    }

    /**
     * Construct a path within a pack
     * @private
     */
    _constructPackPath(packPath, subPath) {
        return packPath === '.' ? subPath + '/' : `${packPath}/${subPath}/`;
    }

    // ========== EXPORT ==========

    /**
     * Generate a blob for download
     * @returns {Promise<Blob>}
     */
    async toBlob() {
        return await this._zip.generateAsync({ type: 'blob' });
    }

    /**
     * Download the MCADDON file
     * @param {string} suffix - Suffix to add to filename (e.g., '_modified')
     * @returns {Promise<string>} The output filename
     */
    async download(suffix = '') {
        const blob = await this.toBlob();
        const outputFileName = this._fileName.replace(/\.mcaddon$/i, `${suffix}.mcaddon`);
        downloadBlob(blob, outputFileName);
        return outputFileName;
    }
}

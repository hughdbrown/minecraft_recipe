# Minecraft Recipe Generator - Project Documentation

## Project Overview
A web-based tool for creating and managing Minecraft Bedrock Edition recipes and MCADDON files. The application provides multiple features for working with Minecraft content creation, including recipe generation, MCADDON editing, file combination, diffing, validation, applying builtin features to items, PNG asset management, and block/item editing.

## Architecture

### File Structure
The application is split into three separate files:
- **minecraft_recipe.html** (725 lines): HTML structure and markup
- **minecraft_recipe.css** (1,551 lines): All styling and visual design
- **minecraft_recipe.js** (4,899 lines): Application logic and functionality
- **Total**: 7,175 lines
- **Dependencies**: JSZip library (CDN) for MCADDON manipulation

### Screen System
- Screens managed by `switchScreen(index)` function
- **8 screens total (0-7)**
- Each screen has dedicated state variables
- Navigation via vertical nav panel on left

### State Management Pattern
```javascript
// Each feature has isolated state variables with feature-specific prefixes
// Example from Builtin Features:
let builtinSelectedFeature = null;
let builtinMcAddonFile = null;
let builtinZip = null;
let builtinFilteredItems = [];
let builtinSelectedItem = null;
let builtinFoodEffects = [];
let builtinEffectCounter = 0;
let builtinModifiedZip = null;

// Example from PNG Editor:
let pngMcAddonFile = null;
let pngZip = null;
let pngCurrentOperation = null;
let pngFiles = [];
let pngSelectedPath = null;
let pngLocalFile = null;
let pngLocalFileData = null;
let pngModifiedZip = null;

// Example from Edit Blocks/Items:
let editBlocksItemsFile = null;
let editBlocksItemsZip = null;
let editBlocksItemsItems = [];
let editBlocksItemsBlocks = [];
let editBlocksItemsChanges = [];
```

### Common Utilities
- `readFileAsArrayBuffer(file)`: Read files for ZIP processing
- `downloadFile(content, fileName, mimeType)`: Trigger downloads
- `downloadBlob(blob, fileName)`: Download blob objects
- `formatFileSize(bytes)`: Human-readable file sizes

## Current Features

### 1. Recipe Maker (Screen 0)
Converts recipe definitions to JSON format for Minecraft Bedrock Edition.

#### Two Input Modes:
**Text View (Default):**
- Text-based recipe definitions using 3x3 pattern
- Simple syntax for defining crafting patterns
- Direct text-to-JSON conversion

**Grid View:**
- Visual 3x3 clickable grid interface
- Each cell has dropdown selection for:
  - Vanilla items
  - Items scanned from loaded MCADDON
  - Blank cells
- More intuitive for visual recipe design

#### Two Output Modes:
- **JSON Only**: Convert standalone recipe to JSON file
- **JSON + MCADDON**: Add recipe to existing MCADDON file

#### Key Features:
- Supports 3x3 crafting table patterns
- Toggle between text and grid views
- Non-destructive MCADDON modification
- Preview before download

### 2. Edit MCADDON Files (Screen 1)
Three-step workflow for editing JSON files within MCADDON packages.

#### Workflow:
1. **Select MCADDON**: Load the package file
2. **Browse & Select**: Navigate file tree to find JSON file
3. **Edit**: Modify JSON in text editor
4. **Save & Download**: Package changes back into MCADDON

#### Features:
- Tree-based file browser with expandable folders
- JSON syntax highlighting and validation
- Non-destructive editing (creates modified copy)
- Preview file structure before editing

### 3. Combine MCADDON Files (Screen 2)
Merge two MCADDON files together safely.

#### Workflow:
1. Select **destination** MCADDON (base file)
2. Select **source** MCADDON (files to merge in)
3. Review merge preview
4. Download combined result

#### Features:
- Non-destructive merging (only adds missing content)
- Detailed merge results showing:
  - Files added from source
  - Files already present (skipped)
  - Conflict resolution summary
- Preserves all existing content in destination

### 4. Diff MCADDON Files (Screen 3)
Compare two versions of MCADDON files to see changes.

#### Workflow:
1. Select **Version 1** (older version)
2. Select **Version 2** (newer version)
3. Review hierarchical diff results

#### Features:
- Shows files only in v1 (removed)
- Shows files only in v2 (added)
- Shows modified files (changed content)
- Hierarchical tree view of differences
- File-level comparison (not line-by-line)

### 5. Validate MCADDON (Screen 4)
Automatic validation of MCADDON structure and content.

#### Validation Checks:
- **JSON Formatting**: All JSON files parse correctly
- **Manifest Structure**: Required manifest.json files present and valid
- **Display Names**: Recipes, items, and blocks have proper display names
- **File Type Validation**: Type-specific validation rules
- **Pack Structure**: Behavior pack and resource pack organization

#### Features:
- Comprehensive error reporting
- Warning vs. error classification
- Specific file and line number references
- Validation summary with pass/fail status

### 6. Builtin Features (Screen 5)
Apply predefined feature modifications to items in MCADDON files.

#### Current Builtin Features:
**Food Effects** - Add potion effects to food items

#### Food Effects Feature

**Workflow:**
1. Click "Food Effects" button
2. Select MCADDON file
3. Choose a food item (auto-filtered to items with `minecraft:food` component)
4. Add one or more effects using "+ Add Effect" button
5. Configure each effect:
   - **Tag**: Effect name (e.g., "regeneration", "speed", "poison")
   - **Duration**: Seconds (automatically converted to ticks × 20)
   - **Intensity**: Level 1-255
6. Submit to apply changes
7. Download modified MCADDON

**Technical Implementation:**
- **Format Version**: Automatically converts to 1.10 (vanilla Enchanted Golden Apple format)
- **File Splitting**: Creates separate BP and RP item files
  - **BP file**: Functional components (`minecraft:food` + effects, `minecraft:max_stack_size`, etc.)
  - **RP file**: Visual components (`minecraft:icon`, textures)
- **Component Cleanup**: Removes incompatible 1.20+ components
- **Effect Format**: `{name: "minecraft:tag", duration: ticks, amplifier: intensity-1}`
- **Non-destructive**: Appends to existing effects array

**Why Format 1.10:**
- Format 1.10 confirmed working for food effects in community testing
- Matches vanilla Enchanted Golden Apple implementation
- Format versions 1.16.100+ and 1.20.50+ have bugs with food effects

**Conversion Process:**
1. Detect original format_version
2. Split functional vs. visual components
3. Remove incompatible 1.20+ components (`menu_category`, `minecraft:use_modifiers`, `minecraft:custom_components`)
4. Convert `minecraft:tags` from object to array format if needed
5. Create/update both BP and RP item files
6. Apply effects to BP file only

**User Notifications:**
```
Food effects applied successfully!

⚠️ REMOVED INCOMPATIBLE COMPONENTS:
  • minecraft:use_modifiers
  • minecraft:custom_components

📋 CHANGES MADE:
  • Format version changed: 1.21.0 → 1.10
  • Using vanilla Enchanted Golden Apple format (split BP/RP files)
  • Items will appear under generic "Items" category in Creative Mode
  • Updated both BP and RP item files (format 1.10 requires split files)

Click Download to save the modified MCADDON file.
```

### 7. Edit PNGs (Screen 6)
Complete PNG asset management system for MCADDON files.

#### Four Operations:

**Delete PNG:**
- Browse PNG files in tree view
- Select file to delete
- Confirm deletion
- Download modified MCADDON

**Add PNG:**
- Select PNG from local file system
- Browse MCADDON folder structure
- Choose destination folder (or root)
- Confirm addition with original filename
- Download modified MCADDON

**Replace PNG:**
- Select PNG from local file system
- Browse existing PNG files in MCADDON
- Choose PNG to replace
- Confirm replacement (keeps path/filename, replaces content)
- Download modified MCADDON

**Download PNG:**
- Browse PNG files in tree view
- Select PNG to extract
- Confirm download
- Individual PNG file downloaded (not MCADDON)

#### Implementation Details:
- **File Browser**: Tree view with expandable/collapsible folders
- **File Count Badges**: Shows number of files in each folder
- **File Size Display**: Human-readable file sizes
- **PNG-Only Filtering**: Only shows PNG files and their parent folders
- **No Operation Chaining**: Each operation completes independently
- **Modified Naming**: Adds `_modified` suffix to MCADDON downloads
- **Flexible Tree Rendering**: `renderPngTree()` supports:
  - Show/hide files for folder-only selection
  - Make folders clickable for Add operation
  - Custom click handlers per operation type

#### State Management:
```javascript
let pngMcAddonFile = null;        // Selected MCADDON file
let pngZip = null;                // Loaded JSZip instance
let pngCurrentOperation = null;   // Current operation: 'delete', 'add', 'replace', 'download'
let pngFiles = [];                // Array of PNG files in MCADDON
let pngSelectedPath = null;       // Selected file/folder path
let pngLocalFile = null;          // Local PNG file (for add/replace)
let pngLocalFileData = null;      // ArrayBuffer of local file
let pngModifiedZip = null;        // Modified ZIP for download
```

### 8. Edit Blocks/Items (Screen 7)
Comprehensive editor for managing blocks and items in MCADDON files.

#### Capabilities:
- **Delete Items/Blocks**: Remove entire item or block (removes from both BP and RP)
- **Edit Display Names**: Modify user-facing names
- **Edit Identifiers**: Change internal IDs (updates all references throughout MCADDON)

#### Workflow:
1. Select MCADDON file
2. View alphabetically sorted index of items and blocks
3. Edit inline:
   - Display names
   - Identifier names
4. Delete items/blocks with confirmation dialog
5. Apply all changes at once
6. Download modified MCADDON

#### Features:
- **Separate Sections**: Items listed first, then Blocks
- **Inline Editing**: Edit directly in the interface
- **Batch Changes**: Modify multiple items before saving
- **Delete Confirmation**: Safety dialog for destructive actions
- **Identifier Updates**: Automatically updates all references when identifier changes
- **Non-destructive**: Creates modified copy for download

#### UI Components:
- File selector
- Item/Block index with:
  - Display name (editable)
  - Identifier (editable)
  - Delete icon (right side)
- Save/Export button
- Download button (appears after save)

## MCADDON File Structure

### Behavior Pack Detection
- Searches for `manifest.json` files
- Identifies behavior packs via `modules[].type === 'data'`
- Behavior pack path used as base for item/recipe/block paths

### Resource Pack Detection
- Searches for `manifest.json` files
- Identifies resource packs via `modules[].type === 'resources'`
- Resource pack path used for textures, models, and visual components

### Common Paths
- Items: `{behaviorPack}/items/*.json`
- Recipes: `{behaviorPack}/recipes/*.json`
- Blocks: `{behaviorPack}/blocks/*.json`
- Textures: `{resourcePack}/textures/**/*.png`

## Important Patterns

### ZIP File Handling
```javascript
// Load MCADDON
const data = await readFileAsArrayBuffer(file);
const zip = await JSZip.loadAsync(data);

// Iterate files
for (const [path, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir && path.endsWith('.json')) {
        const content = await zipEntry.async('string');
        // Process JSON
    }
}

// Modify and download
const blob = await zip.generateAsync({ type: 'blob' });
downloadBlob(blob, 'filename.mcaddon');
```

### Validation Pattern
- **Field-level validation**: Real-time on input
- **Form-level validation**: Comprehensive on submit
- **Visual feedback**: Error borders + error messages
- **Error clearing**: Messages clear when value becomes valid

### Download Button Pattern
- Initially hidden (`style="display: none;"`)
- Appears after successful operation
- Feature-specific naming (e.g., `downloadCombinedBtn`, `downloadBuiltinBtn`)
- Isolated per screen (only one visible at a time)

### Modified File Naming
- Original: `mypack.mcaddon`
- Modified: `mypack_modified.mcaddon`
- Prevents overwriting original files

## Extension Guides

### Adding New Builtin Features

The system is designed for easy extension. To add a new builtin feature:

**1. Add to `builtinFeatures` array:**
```javascript
{
    id: 'your_feature_id',
    name: 'Display Name',
    description: 'What this feature does',
    filterFunction: async (zip) => {
        // Return array of items that match your criteria
        // Each item should have: path, identifier, content, data
        return items;
    }
}
```

**2. Add HTML container in screen-builtin section:**
```html
<div id="yourFeatureContainer" style="display: none;">
    <!-- Your feature UI here -->
</div>
```

**3. Add configuration logic in `selectBuiltinItem()`:**
```javascript
if (builtinSelectedFeature.id === 'your_feature_id') {
    document.getElementById('yourFeatureContainer').style.display = 'block';
    // Initialize your feature UI
}
```

**4. Add submit logic in `submitBuiltinFeature()`:**
```javascript
if (builtinSelectedFeature.id === 'your_feature_id') {
    // Apply your feature modifications
}
```

## Testing Guidelines

### Manual Testing Workflow - Builtin Features (Food Effects)

1. Open `minecraft_recipe.html` in browser
2. Click "Builtin Features" in nav
3. Click "Food Effects" button
4. Select valid MCADDON with food items
5. Select a food item from filtered list
6. Click "+ Add Effect"
7. Fill in effect details:
   - Tag: "regeneration", "speed", "poison", etc.
   - Duration: 30, 60, 120 (seconds)
   - Intensity: 1, 2, 3 (range 1-255)
8. Test validation:
   - Duration: Try 0, negative, non-numeric
   - Intensity: Try 0, 256, negative
9. Click Submit
10. Verify success message and format conversion notice
11. Click Download
12. Extract and verify MCADDON contains:
    - BP item file (format 1.10, functional components + effects)
    - RP item file (format 1.10, visual components only)

**Expected BP File Structure:**
```json
{
  "format_version": "1.10",
  "minecraft:item": {
    "description": {
      "identifier": "namespace:item_name"
    },
    "components": {
      "minecraft:food": {
        "nutrition": 4,
        "effects": [
          {
            "name": "minecraft:regeneration",
            "duration": 600,
            "amplifier": 1
          }
        ]
      }
    }
  }
}
```

**Expected RP File Structure:**
```json
{
  "format_version": "1.10",
  "minecraft:item": {
    "description": {
      "identifier": "namespace:item_name"
    },
    "components": {
      "minecraft:icon": "item_texture_name"
    }
  }
}
```

### Manual Testing Workflow - PNG Editor

**General Setup:**
1. Open `minecraft_recipe.html` in browser
2. Click "Edit PNGs" in nav
3. Select valid MCADDON with PNG files

**Delete PNG:**
1. Click "Delete PNG"
2. Expand folders, click PNG file
3. Verify selected path displayed
4. Click "Confirm Delete"
5. Verify success message
6. Download and verify removal

**Add PNG:**
1. Click "Add PNG"
2. Select PNG from computer
3. Verify file info displayed
4. Click destination folder (or root)
5. Verify selected folder path
6. Click "Confirm Add"
7. Verify success with target path
8. Download and verify addition

**Replace PNG:**
1. Click "Replace PNG"
2. Select PNG from computer
3. Verify file info displayed
4. Expand folders, click PNG to replace
5. Verify selected path
6. Click "Confirm Replace"
7. Download and verify replacement

**Download PNG:**
1. Click "Download PNG"
2. Expand folders, click PNG file
3. Verify selected path
4. Click "Confirm Download"
5. Verify PNG downloads correctly
6. Open PNG to confirm validity

**Cancel Testing:**
- Click "Cancel" in any operation
- Verify return to operation selector
- Verify state reset

### Manual Testing Workflow - Edit Blocks/Items

1. Open `minecraft_recipe.html` in browser
2. Click "Edit Blocks/Items" in nav
3. Select MCADDON file
4. Verify Items section appears first
5. Verify Blocks section appears second
6. Test inline editing:
   - Edit display name
   - Edit identifier
   - Verify changes reflected
7. Test deletion:
   - Click delete icon
   - Verify confirmation dialog
   - Confirm deletion
   - Verify item removed from list
8. Apply multiple changes
9. Click Save/Export
10. Verify success message
11. Download modified MCADDON
12. Extract and verify:
    - Identifier changes propagated throughout
    - Display names updated
    - Deleted items removed from BP and RP

## Code Quality Notes

### CSS Organization
- Well-structured with clear class naming
- Consistent spacing and transitions
- Feature-specific sections clearly marked
- Responsive design patterns
- Reusable component classes

### JavaScript Organization
- Recipe Parser class: Core parsing logic
- Global state: Feature-isolated variables
- Screen management: Centralized switching
- Feature-specific functions organized by screen
- Clear section headers: `// ========== SECTION ==========`

### Maintainability
- **Feature Isolation**: Each screen has own state and functions
- **Reusable Utilities**: File I/O, ZIP handling, validation
- **Consistent Patterns**: All features follow same workflow structure
- **Clear Naming**: Feature prefixes (e.g., `builtin*`, `combine*`, `diff*`, `png*`, `editBlocksItems*`)
- **State Management**: Isolated state prevents cross-contamination
- **Error Handling**: Consistent try-catch with user-friendly messages

## Recent Changes

### 2026-01-01: McAddon Object Model Refactoring
- **Added**: Comprehensive `McAddon` class in separate `mcaddon.js` file
- **Migrated**: All MCADDON utility functions to use McAddon class
- **Refactored**: Recipe injection function to use clean McAddon API

#### McAddon Class Features:
  - Factory methods: `McAddon.fromFile(file)` and `McAddon.fromZip(zip)`
  - Pack navigation: `getBehaviorPack()`, `getResourcePack()`
  - Content queries: `getItems()`, `getBlocks()`, `getRecipes()`
  - Item/block search: `findItem(identifier)`, `filterItems(fn)`
  - Resource pack utilities: `findResourcePackItemFile(identifier)`
  - Immutable modifications: `addFile()`, `removeFile()`, `addRecipe()`
  - Export: `toBlob()`, `download(suffix)`
  - Internal caching for performance optimization

#### Implementation Details:
  - **New File**: `mcaddon.js` (454 lines) - McAddon class implementation
  - **Updated File**: `minecraft_recipe.js` - Reduced from 5,327 to 4,794 lines (533 lines removed, 10% reduction)
  - **Updated File**: `minecraft_recipe.html` - Added script tag for mcaddon.js
  - **Utility Functions**: Converted to thin 2-3 line wrappers delegating to McAddon
    - `findBehaviorPack()` - reduced from 25 to 3 lines
    - `findResourcesPack()` - reduced from 25 to 3 lines
    - `findResourcePackItemFile()` - reduced from 23 to 3 lines
    - `extractJsonFiles()` - reduced from 20 to 3 lines
  - **Recipe Function**: `convertAndInject()` - reduced from 46 to 25 lines (46% reduction)

#### Benefits:
  - **Single Source of Truth**: All MCADDON logic in mcaddon.js
  - **Eliminated Duplication**: ~100 lines of duplicate code removed
  - **Separation of Concerns**: Object model in separate file
  - **Caching**: Expensive operations cached automatically
  - **Immutability**: Modification operations return new instances
  - **Backwards Compatible**: Thin wrapper functions maintain API compatibility
  - **Cleaner Code**: Declarative API vs imperative ZIP manipulation

#### Example Usage:
  ```javascript
  // Modern approach - Clean and declarative
  const mcaddon = await McAddon.fromFile(file);
  const modified = await mcaddon.addRecipe('my_recipe.json', recipeJson);
  await modified.download('_web');

  // Legacy approach still works through wrappers
  const zip = await loadMcAddonZip(file);
  const behaviorPack = await findBehaviorPack(zip);  // Now delegates to McAddon
  ```

- **Total Line Count**: 7,175 → 7,097 lines (78 line reduction across all files)
- **JavaScript**: 5,327 → 4,794 lines (-533 lines, 10% reduction)
- **New mcaddon.js**: +454 lines (clean object model implementation)

### 2026-01-01: Edit Blocks/Items Feature Implementation
- **Added**: Complete block and item editing system (Screen 7)
- **Features**:
  - Delete entire items/blocks from MCADDON
  - Edit display names inline
  - Edit identifiers with automatic reference updates
  - Alphabetically sorted display (Items first, then Blocks)
  - Batch editing with single download
  - Delete confirmation dialogs

- **Implementation**:
  - New navigation button for Screen 7
  - State management with `editBlocksItems*` prefix
  - Inline editing UI with immediate feedback
  - Identifier tracking and update system
  - Dual-section display (Items, then Blocks)

- Files modified: `minecraft_recipe.html`, `minecraft_recipe.css`, `minecraft_recipe.js`
- New screen added to navigation

### 2025-12-XX: File Structure Refactoring
- **Major Change**: Split single HTML file into three separate files
  - `minecraft_recipe.html`: Structure (725 lines)
  - `minecraft_recipe.css`: Styling (1,551 lines)
  - `minecraft_recipe.js`: Logic (4,899 lines)
- **Benefits**:
  - Better code organization
  - Easier maintenance
  - Clearer separation of concerns
  - Improved development workflow

### 2025-12-XX: Grid View Implementation
- **Added**: Visual grid-based recipe creation (Screen 0)
- **Features**:
  - Toggle between Text View and Grid View
  - 3x3 clickable grid interface
  - Dropdown selection per cell:
    - Vanilla items
    - Items from loaded MCADDON
    - Blank cells
  - Same JSON output as Text View
  - More intuitive visual recipe design

- **Implementation**:
  - View toggle buttons
  - Grid UI components
  - Item selection dropdowns
  - Grid-to-JSON conversion logic
  - Maintains compatibility with existing recipe format

### 2025-12-30: Edit PNGs Feature Implementation
- **Added**: Complete PNG file editing system (Screen 6)
- **Four Operations**:
  - Delete PNG: Remove PNG files from MCADDON
  - Add PNG: Add local PNG files to any folder
  - Replace PNG: Replace existing PNGs with local files
  - Download PNG: Extract individual PNGs

- **Key Features**:
  - Tree-based file browser
  - Expandable/collapsible folder navigation
  - File count badges
  - No operation chaining
  - Modified MCADDON naming (`_modified` suffix)
  - Flexible tree rendering

- Files modified: `minecraft_recipe.html`, `minecraft_recipe.css`, `minecraft_recipe.js`
- Lines added: ~600 total

### 2025-12-21: Food Effects Bug Fix (Format 1.10 with Split Files)
- **Fixed**: Food effects not working in Minecraft
- **Root Cause**: Format versions 1.16.100+ and 1.20.50+ have bugs
- **Solution**: Format 1.10 with split BP/RP files

- **New Conversion System**:
  - `convertToFormat1_10()` function splits items into BP/RP
  - Detects original format_version
  - Splits functional vs. visual components
  - Removes incompatible 1.20+ components
  - Converts `minecraft:tags` object → array
  - Creates/updates both BP and RP files

- **Enhanced User Notifications**:
  - Shows format version change
  - Lists removed incompatible components
  - Explains split file requirement
  - Warns about Creative Mode category change

- **Food Effects Processing**:
  - Automatic "minecraft:" prefix
  - Duration seconds → ticks conversion (× 20)
  - Effects in BP file only
  - RP file visual components only

- **Helper Functions**:
  - `convertToFormat1_10()`: BP/RP splitting
  - `findResourcePackItemFile()`: RP item location

- Files modified: `minecraft_recipe.html`, `minecraft_recipe.css`, `minecraft_recipe.js`
- Lines added/modified: ~250+

### 2025-12-20: Builtin Features Implementation
- **Added**: Complete Builtin Features system (Screen 5)
- **First Feature**: Food Effects
- **Architecture**:
  - Extensible feature system
  - Filter function pattern
  - Dynamic form generation
  - Real-time validation
  - Non-destructive modifications
  - Modified file downloads

- Files modified: `minecraft_recipe.html`, `minecraft_recipe.css`, `minecraft_recipe.js`
- Lines added: ~400+

## Future Enhancement Opportunities

### Potential Builtin Features
- **Weapon Enchantments**: Filter for weapons/tools, apply enchantments
- **Armor Properties**: Filter for armor items, modify protection/durability
- **Block Behaviors**: Filter for custom blocks, add/modify behaviors
- **Entity Spawn Eggs**: Filter for spawn eggs, configure entity properties
- **Potion Effects**: Filter for potions, customize effect combinations

### PNG Editor Enhancements
- Batch operations: Delete/replace multiple PNGs at once
- PNG preview thumbnails in file browser
- Rename PNG files (change filename, keep location)
- Move PNGs between folders
- Image validation (dimensions, file integrity)
- Convert image formats (JPG → PNG, etc.)
- Resize/compress PNGs before adding

### Recipe Maker Enhancements
- Recipe templates library
- Recipe validation against Minecraft rules
- Custom recipe types (shapeless, furnace, etc.)
- Recipe preview/visualization
- Bulk recipe creation
- Recipe import from existing MCADDON

### Edit Blocks/Items Enhancements
- Component editor: Modify item/block components directly
- Bulk operations: Edit multiple items at once
- Clone items/blocks: Duplicate and modify
- Template system: Apply common patterns
- Component validation: Check for errors before save
- Search/filter: Find items by name or component

### UI Improvements
- Multi-item selection for batch operations
- Undo/Redo functionality
- Preview changes before download
- Export/Import feature configurations
- Keyboard shortcuts
- Drag-and-drop file uploads
- Dark mode support
- Mobile responsive design

### Technical Improvements
- Toast notifications instead of alerts
- Progress indicators for large operations
- Local storage for recent files/settings
- WebAssembly for performance-critical operations
- Service worker for offline support
- Automated testing suite
- Error logging and diagnostics

---

## Recommended Refactorings (To Be Implemented)

The following refactorings have been identified as high-value improvements to the codebase. They build upon the McAddon object model refactoring completed on 2026-01-01.

### Refactoring #2: Convert Features to Self-Contained Modules/Classes

**Current State:**
Each feature (Editor, Combine, Diff, Builtin Features, PNG Editor, Edit Blocks/Items) is implemented with:
- 5-10 global state variables prefixed by feature name
- 10-20 global functions prefixed by feature name
- Mixed DOM manipulation and business logic

**Proposed Change:**
Convert each feature into a class with encapsulated state:

```javascript
class BuiltinFeaturesManager {
    #selectedFeature = null;
    #mcaddon = null;
    #filteredItems = [];
    #selectedItem = null;
    #foodEffects = [];

    constructor(domElements) {
        this.ui = domElements; // References to DOM elements
    }

    async selectFeature(feature) { /* ... */ }
    async loadMcAddon(file) { /* ... */ }
    selectItem(item) { /* ... */ }
    addFoodEffect() { /* ... */ }
    async apply() { /* ... */ }
}

// Similar classes for:
// - McAddonEditorManager
// - CombineManager
// - DiffManager
// - PngEditorManager
// - BlocksItemsEditorManager
```

**Advantages:**
- **Eliminates Global State**: All state is private to class instances
- **Clear Boundaries**: Each feature is independent and self-contained
- **Easier Testing**: Mock dependencies, test features in isolation
- **Better Organization**: Related code grouped together
- **Namespace Protection**: No naming collisions between features
- **Memory Management**: Garbage collection can clean up feature state when done

**Implementation Notes:**
- Start with one feature (e.g., Combine) as a proof of concept
- Gradually migrate other features using the same pattern
- Maintain backwards compatibility during migration
- Each manager class should use the McAddon object model internally

---

### Refactoring #3: Separate UI Layer from Business Logic

**Current State:**
Functions mix:
- DOM manipulation (`document.getElementById`, `innerHTML =`)
- Business logic (validation, transformation)
- File operations (reading, writing, downloading)

Example from `formatJson()`:
```javascript
function formatJson() {
    const editor = document.getElementById('jsonEditor');  // DOM
    const errorDiv = document.getElementById('validationError');  // DOM
    try {
        const parsed = JSON.parse(editor.value);  // Business logic
        editor.value = JSON.stringify(parsed, null, 2);  // Business + DOM
        errorDiv.style.display = 'none';  // DOM
    } catch (error) {
        errorDiv.textContent = `Invalid JSON: ${error.message}`;  // DOM
        errorDiv.style.display = 'block';  // DOM
    }
}
```

**Proposed Change:**
Adopt a layered architecture:

```javascript
// Business Logic Layer (pure functions/classes)
class JsonFormatter {
    static format(jsonString) {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    }
}

// UI Layer (handles DOM)
class JsonEditorUI {
    constructor(editorElement, errorElement) {
        this.editor = editorElement;
        this.error = errorElement;
    }

    formatJson() {
        try {
            const formatted = JsonFormatter.format(this.editor.value);
            this.editor.value = formatted;
            this.hideError();
        } catch (error) {
            this.showError(`Invalid JSON: ${error.message}`);
        }
    }

    showError(message) { /* ... */ }
    hideError() { /* ... */ }
}
```

**Advantages:**
- **Testability**: Pure business logic can be tested without DOM
- **Reusability**: Business logic can be used in different contexts
- **Clarity**: Clear separation between "what to do" vs "how to display it"
- **Maintainability**: UI changes don't affect business logic and vice versa
- **Performance**: Can optimize business logic separately from rendering

**Implementation Notes:**
- Identify pure business logic functions (validation, transformation, calculation)
- Extract them into separate utility classes/modules
- Create UI wrapper classes that handle DOM manipulation
- Use dependency injection to connect UI layer with business logic

---

### Refactoring #4: Create a Unified File/Resource Manager

**Current State:**
Each feature independently handles:
- File reading (`readFileAsText`, `readFileAsArrayBuffer`)
- File downloading (`downloadFile`, `downloadBlob`)
- Filename generation (`generateModifiedFileName`)
- File info display (`updateFileInfo`, `formatFileSize`)

**Proposed Change:**
Create a centralized resource manager:

```javascript
class FileManager {
    static async readAsText(file) { /* ... */ }
    static async readAsArrayBuffer(file) { /* ... */ }

    static download(content, fileName, mimeType = 'application/octet-stream') { /* ... */ }
    static downloadBlob(blob, fileName) { /* ... */ }

    static formatSize(bytes) { /* ... */ }
    static generateModifiedName(originalName, suffix) { /* ... */ }

    // Could add caching, progress tracking, etc.
    static async readWithProgress(file, onProgress) { /* ... */ }
}
```

**Advantages:**
- **Consistency**: All file operations work the same way
- **Enhancement Point**: Easy to add features like progress bars, caching, error recovery
- **Error Handling**: Centralized error handling for file operations
- **Browser Compatibility**: Handle browser differences in one place
- **Performance**: Can add intelligent caching/memoization

**Implementation Notes:**
- Create FileManager class with static methods for compatibility
- Migrate existing file utility functions one by one
- Add new features (progress tracking, better error messages) incrementally
- Consider adding file type detection and validation

---

### Refactoring #5: Extract Validation into a Dedicated Validation System

**Current State:**
Validation logic (lines 2614-3250+) is:
- 600+ lines in global scope
- Mixed with display logic
- Hard to extend with new validation rules
- Global state (`validateFile`, `validateZip`, `validationResults`)

**Proposed Change:**
Create a validation framework:

```javascript
class McAddonValidator {
    #rules = [];
    #results = { errors: [], warnings: [], passed: false };

    constructor(mcaddon) {
        this.mcaddon = mcaddon;
        this.registerDefaultRules();
    }

    registerRule(rule) {
        this.#rules.push(rule);
    }

    async validate() {
        this.#results = { errors: [], warnings: [], passed: false };

        for (const rule of this.#rules) {
            await rule.validate(this.mcaddon, this.#results);
        }

        this.#results.passed = this.#results.errors.length === 0;
        return this.#results;
    }

    registerDefaultRules() {
        this.registerRule(new StructureValidationRule());
        this.registerRule(new ManifestValidationRule());
        this.registerRule(new JsonSyntaxValidationRule());
        this.registerRule(new DisplayNameValidationRule());
        this.registerRule(new AnomalyDetectionRule());
    }
}

class ValidationRule {
    async validate(mcaddon, results) {
        throw new Error('Must implement validate()');
    }
}

class StructureValidationRule extends ValidationRule {
    async validate(mcaddon, results) {
        // Current validateStructure() logic
    }
}

// etc. for each rule type
```

**Advantages:**
- **Extensibility**: Easy to add new validation rules without modifying existing code
- **Testability**: Test each validation rule independently
- **Reusability**: Validation rules can be composed and reused
- **Configurability**: Enable/disable specific rules, set severity levels
- **Clarity**: Each rule is self-contained and focused
- **Plugin Architecture**: Third-party validation rules can be added

**Implementation Notes:**
- Start with base ValidationRule class
- Extract each validation function into its own rule class
- Create validator that orchestrates rule execution
- Add configuration system for enabling/disabling rules
- Consider adding rule priorities for execution order

---

## Implementation Priority

The recommended order for implementing these refactorings is:

1. **McAddon Object Model** ✅ - COMPLETED (2026-01-01)
2. **File/Resource Manager** (#4) - Foundation for other refactorings
3. **UI Layer Separation** (#3) - Enables better testing
4. **Feature Classes** (#2) - Builds on McAddon and FileManager
5. **Validation System** (#5) - Final polish, can use McAddon directly

Each refactoring is **incremental** and can be done without breaking existing functionality. The legacy code can remain functional during the migration period.

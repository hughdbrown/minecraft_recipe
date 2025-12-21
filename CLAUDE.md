# Minecraft Recipe Generator - Project Documentation

## Project Overview
A web-based tool for creating and managing Minecraft Bedrock Edition recipes and MCADDON files. The application provides multiple features for working with Minecraft content creation, including recipe generation, MCADDON editing, file combination, diffing, validation, and applying builtin features to items.

## Current Features

### 1. Recipe Maker (Screen 0)
- Converts text-based recipe definitions to JSON format
- Supports 3x3 crafting table patterns
- Two modes:
  - Convert standalone TXT to JSON
  - Add recipe to existing MCADDON file
- **Location**: Lines 907-967 (HTML), Lines 1419-1511 (JavaScript)

### 2. Edit MCADDON Files (Screen 1)
- Three-step workflow for editing JSON files within MCADDON packages
- Extract, view, and modify any JSON file
- Save changes back to MCADDON with download
- **Location**: Lines 1171-1231 (HTML), Lines 1559-1764 (JavaScript)

### 3. Combine MCADDON Files (Screen 2)
- Merge two MCADDON files (source into destination)
- Only adds content not present in destination (non-destructive)
- Shows detailed merge results
- **Location**: Lines 1234-1269 (HTML), Lines 1909-2226 (JavaScript)

### 4. Diff MCADDON Files (Screen 3)
- Compare two versions of MCADDON files
- Shows hierarchical view of differences
- Displays: files only in v1, only in v2, and modified files
- **Location**: Lines 1272-1312 (HTML), Lines 2229-2546 (JavaScript)

### 5. Validate MCADDON (Screen 4)
- Automatic validation of MCADDON structure
- Checks for:
  - Proper JSON formatting
  - Required manifest structure
  - Display names in recipes/items/blocks
  - File type-specific validation
- **Location**: Lines 1315-1340 (HTML), Lines 2939-3645 (JavaScript)

### 6. Builtin Features (Screen 5) **[NEWLY IMPLEMENTED]**
- Apply predefined features to items in MCADDON files
- Currently supports: **Food Effects**
- Extensible architecture for adding more builtin features

#### Food Effects Feature
- **Workflow**:
  1. Select "Food Effects" builtin feature
  2. Choose MCADDON file
  3. Select a food item (automatically filtered)
  4. Add/configure food effects (tag, duration, intensity)
  5. Submit to apply effects
  6. Download modified MCADDON

- **Implementation Details**:
  - Filter function: Finds behavior pack → items directory → items with `minecraft:food` component
  - Effects appended to existing effects (non-destructive)
  - JSON structure: `{name: "minecraft:tag", duration: ticks, amplifier: intensity-1}`
  - Real-time validation with error messages
  - Duration: positive integer (seconds, converted to ticks automatically: seconds × 20)
  - Intensity: 1-255 range
  - Tag: free-form text ("minecraft:" prefix added automatically if not present)
  - **Format Version**: Automatically changed to 1.10 (vanilla Enchanted Golden Apple format)
  - Items are split into TWO files: behavior pack (functional) and resource pack (visual)
  - Creates RP item file if it doesn't exist

- **Location**:
  - HTML: Lines 1344-1412
  - CSS: Lines 893-1093
  - JavaScript State: Lines 1579-1663
  - JavaScript Functions: Lines 3647-3974

## Architecture

### File Structure
- **Single HTML file**: `minecraft_recipe.html` (3,978 lines)
- Self-contained with embedded CSS and JavaScript
- Uses JSZip library (CDN) for MCADDON manipulation

### Screen System
- Screens managed by `switchScreen(index)` function (Line 1665)
- 6 screens total (0-5)
- Each screen has dedicated state variables
- Navigation via vertical nav panel on left

### State Management Pattern
```javascript
// Each feature has isolated state variables
// Example from Builtin Features:
let builtinSelectedFeature = null;
let builtinMcAddonFile = null;
let builtinZip = null;
let builtinFilteredItems = [];
let builtinSelectedItem = null;
let builtinFoodEffects = [];
let builtinEffectCounter = 0;
let builtinModifiedZip = null;
```

### Common Utilities
- `readFileAsArrayBuffer(file)`: Read files for ZIP processing (Line 1514)
- `downloadFile(content, fileName, mimeType)`: Trigger downloads (Line 1523)
- `downloadBlob(blob, fileName)`: Download blob objects (Line 1528)
- `formatFileSize(bytes)`: Human-readable file sizes (Line 1539)

## Builtin Features Extension Guide

### Adding New Builtin Features
The system is designed for easy extension. To add a new builtin feature:

1. **Add to `builtinFeatures` array** (Line 1590):
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

2. **Add HTML container** in screen-builtin section (after Line 1404):
```html
<div id="yourFeatureContainer" style="display: none;">
    <!-- Your feature UI here -->
</div>
```

3. **Add configuration logic** in `selectBuiltinItem()` (Line 3752):
```javascript
if (builtinSelectedFeature.id === 'your_feature_id') {
    document.getElementById('yourFeatureContainer').style.display = 'block';
    // Initialize your feature UI
}
```

4. **Add submit logic** in `submitBuiltinFeature()` (Line 3919):
```javascript
if (builtinSelectedFeature.id === 'your_feature_id') {
    // Apply your feature modifications
}
```

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

### Format Version Conversion System

The food effects feature uses format version 1.10 with split BP/RP files (the vanilla Enchanted Golden Apple approach):

**Why Format 1.10 is Used:**
- Format 1.10 is confirmed working for food effects in the community
- Uses the same approach as Mojang's vanilla Enchanted Golden Apple
- Format versions 1.16.100+ and 1.20.50+ have bugs/issues with food effects

**Conversion Process (`convertToFormat1_10` function):**

1. **Detection Phase:**
   - Captures original `format_version`
   - Identifies functional vs. visual components

2. **File Splitting:**
   - **Behavior Pack file** gets functional components:
     - `minecraft:food` (with effects)
     - `minecraft:max_stack_size`
     - `minecraft:hand_equipped`
     - Other gameplay-related components
   - **Resource Pack file** gets visual components:
     - `minecraft:icon`
     - Texture references

3. **Component Handling:**
   - Removes incompatible 1.20+ components
   - Converts `minecraft:tags` from object to array format (if needed)

4. **File Creation:**
   - Updates existing BP item file
   - Creates or updates RP item file
   - Both files use same identifier

**User Notification Example:**
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

**Split File Structure:**
- Behavior pack item: Functional components + effects
- Resource pack item: Visual components only
- Both files required for format 1.10 to work properly

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
- Field-level validation on input (real-time)
- Form-level validation on submit (comprehensive)
- Visual feedback: error borders + error messages
- Error messages clear when value becomes valid

### Download Button Pattern
- Initially hidden (`style="display: none;"`)
- Appears after successful operation
- Feature-specific (e.g., `downloadCombinedBtn`, `downloadBuiltinBtn`)
- Isolated per screen (only one visible at a time)

## Testing Notes

### Manual Testing Workflow for Builtin Features
1. Open `minecraft_recipe.html` in browser
2. Click "Builtin Features" in nav
3. Click "Food Effects" button
4. Select a valid MCADDON file with food items
5. Select a food item from the filtered list
6. Click "+ Add Effect"
7. Fill in:
   - Tag: e.g., "regeneration", "speed", "poison"
   - Duration: e.g., 30, 60, 120
   - Intensity: e.g., 1, 2, 3 (range 1-255)
8. Test validation:
   - Duration: Try 0, negative, non-numeric
   - Intensity: Try 0, 256, negative
9. Click Submit
10. Click Download
11. Verify modified MCADDON contains updated food item JSON

### Expected Minecraft Item JSON Structure (After Food Effects Applied)

**Behavior Pack File** (`BP/items/item_name.json`):
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

**Resource Pack File** (`RP/items/item_name.json`):
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

**Note**: Duration is in ticks (600 ticks = 30 seconds). Format version 1.10 uses split BP/RP files (vanilla Enchanted Golden Apple format).

## Recent Changes

### 2025-12-21: Food Effects Bug Fix (Format 1.10 with Split Files)
- **Fixed**: Food effects not working in Minecraft
- **Root Cause**: Format versions 1.16.100+ and 1.20.50+ have issues with food effects
- **Solution**: Use format version 1.10 with split BP/RP files (vanilla Enchanted Golden Apple approach)

- **New Conversion System**:
  - Added `convertToFormat1_10()` function that splits items into BP and RP files
  - Detects original format_version and creates two separate JSON files
  - **Splits components properly**:
    - **BP file** gets functional components (`minecraft:food`, `minecraft:max_stack_size`, etc.)
    - **RP file** gets visual components (`minecraft:icon`)
  - **Removes incompatible components** that don't work in format 1.10:
    - `menu_category`, `minecraft:use_modifiers`, `minecraft:custom_components`
    - Any 1.20+ components
  - **Converts component formats**:
    - `minecraft:tags` from 1.20.50+ object format to 1.10 array format
  - Creates RP item file if it doesn't exist
  - Provides detailed user feedback about all changes made

- **Enhanced User Notifications**:
  - Shows original → new format version (1.10)
  - Lists all removed incompatible components
  - Explains that files are split into BP and RP
  - Warns that items appear under generic "Items" category

- **Food Effects Processing**:
  - Added automatic "minecraft:" prefix to effect names
  - Convert duration from seconds to ticks (× 20) for proper Minecraft format
  - Effects added to BP file only (functional component)
  - RP file contains visual components only

- **New Helper Functions**:
  - `convertToFormat1_10()`: Splits items into BP/RP format 1.10 structure (Lines 1945-2050)
  - `findResourcePackItemFile()`: Locate RP items by identifier (Lines 1913-1943)

- Files modified: `minecraft_recipe.html`, `CLAUDE.md`
- Lines added/modified: ~250+ lines

### 2025-12-20: Builtin Features Implementation
- Added complete Builtin Features system (Screen 5)
- Implemented Food Effects as first builtin feature
- Features:
  - Extensible architecture for future features
  - Filter function system for finding applicable items
  - Dynamic form generation with add/remove
  - Real-time field validation
  - Non-destructive effect appending
  - Modified file download with `_modified.mcaddon` suffix
- Files modified: `minecraft_recipe.html`
- Lines added: ~400+ (HTML, CSS, JavaScript)

## Code Quality Notes

### CSS Organization
- Global styles: Lines 9-892
- Builtin Features styles: Lines 893-1093
- Well-structured with clear class naming
- Consistent spacing and transitions

### JavaScript Organization
- Recipe Parser class: Lines 1419-1552
- Global state: Lines 1554-1663
- Screen management: Lines 1665-1760
- Feature-specific functions organized by screen
- Clear section headers with `// ========== SECTION ==========`

### Maintainability
- Feature isolation: Each screen has its own state and functions
- Reusable utilities: File I/O, ZIP handling, validation
- Consistent patterns: All features follow same workflow structure
- Clear naming conventions: Feature prefixes (e.g., `builtin*`, `combine*`, `diff*`)

## Future Enhancement Opportunities

### Potential Builtin Features
- Weapon Enchantments (filter for weapons/tools)
- Armor Properties (filter for armor items)
- Block Behaviors (filter for custom blocks)
- Entity Spawn Eggs (filter for spawn eggs)
- Potion Effects (filter for potions)

### UI Improvements
- Multi-item selection for batch operations
- Undo/Redo functionality
- Preview changes before download
- Export/Import feature configurations
- Keyboard shortcuts

### Technical Improvements
- Error handling with toast notifications instead of alerts
- Progress indicators for large file operations
- Local storage for recent files/settings
- Dark mode support
- Mobile responsive design enhancements

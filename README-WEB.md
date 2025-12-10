# Minecraft Recipe Web Interface

A browser-based user interface for the Minecraft Bedrock Recipe Generator. No installation required - just open the HTML file in your web browser.

## Overview

This web interface provides a convenient way to convert Minecraft recipe text files to JSON format directly in your browser. All processing happens client-side using JavaScript - no server or Python installation needed.

## Features

- **Tab 1: JSON Only** - Convert recipe .txt files to JSON format
- **Tab 2: JSON + McAddon** - Convert recipe .txt files and inject into .mcaddon packages
- **Pure client-side** - All processing happens in your browser (JavaScript)
- **No installation** - Just open the HTML file
- **Modern UI** - Clean, responsive interface with drag-and-drop support

## Requirements

- **Modern web browser** with JavaScript enabled:
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Internet connection** (only for initial load to fetch JSZip library from CDN)
- **No Python or other dependencies** required

## How to Use

### Opening the Interface

Simply double-click `minecraft_recipe.html` to open it in your default browser, or:

```bash
# macOS
open minecraft_recipe.html

# Linux
xdg-open minecraft_recipe.html

# Windows
start minecraft_recipe.html
```

Alternatively, right-click the file and select "Open with" → your preferred browser.

### Tab 1: Convert Recipe to JSON

1. Click the "**JSON Only**" tab
2. Click "Select Recipe File (.txt)" and choose your recipe text file
3. Click "**Convert to JSON**"
4. The JSON file will be downloaded to your Downloads folder with the same name as the input file (but with `.json` extension)

**Example:**
- Input: `oil_refinery.txt`
- Output: `oil_refinery.json` (downloaded)

### Tab 2: Convert Recipe and Create McAddon

1. Click the "**JSON + McAddon**" tab
2. Click "Select Recipe File (.txt)" and choose your recipe text file
3. Click "Select Base McAddon File (.mcaddon)" and choose your base .mcaddon file
4. Click "**Convert & Create McAddon**"
5. A new .mcaddon file will be downloaded with the recipe injected

**Example:**
- Input: `oil_refinery.txt` + `Circuits & Machines (7).mcaddon`
- Output: `Circuits & Machines (7)_web.mcaddon` (downloaded)

The output .mcaddon filename will have `_web` appended to distinguish it from the original.

## File Downloads

All generated files are downloaded to your browser's default Downloads folder:

- **JSON files**: Same name as input .txt file with `.json` extension
- **McAddon files**: Original name with `_web` suffix before the extension

Your browser may prompt you to choose a save location depending on your settings.

## Recipe File Format

Recipe files follow the same format as the Python CLI version:

```
namespace:item_identifier
ABC
DEF
GHI
A = namespace:ingredient1
B = namespace:ingredient2
C = namespace:ingredient3
count
```

**Example:**
```
myname:oil_refinery_station
A-A
ABA
ACA
A = minecraft:iron_ingot
B = myname:oil_barrel
C = minecraft:coal
1
```

See the main [README.md](README.md) for detailed format specifications.

## How It Works

### Technology Stack

- **HTML5** - Structure and file handling
- **CSS3** - Modern, responsive styling
- **JavaScript (ES6+)** - Recipe parsing and file processing
- **JSZip** - ZIP file manipulation for .mcaddon files (loaded from CDN)

### Processing Flow

**Tab 1 (JSON Only):**
1. User selects .txt file → JavaScript FileReader API reads the file
2. RecipeParser (JavaScript port of Python version) validates and parses the recipe
3. JSON object is generated following Minecraft Bedrock format
4. JSON is converted to string and downloaded via Blob API

**Tab 2 (JSON + McAddon):**
1. User selects .txt file and .mcaddon file
2. Recipe is parsed (same as Tab 1)
3. JSZip library extracts the .mcaddon (ZIP) contents
4. Behavior pack is located by finding manifest.json with type "data"
5. Recipe JSON is added to the `recipes/` directory in the behavior pack
6. Modified .mcaddon is regenerated and downloaded

### Privacy & Security

- **100% client-side processing** - Your files never leave your computer
- **No server uploads** - Everything happens in your browser
- **No data collection** - No analytics, tracking, or data storage
- **Offline capable** - After initial load, works without internet (if JSZip is cached)

## Troubleshooting

### JavaScript Errors

**Problem**: "JSZip is not defined" or similar error

**Solution**:
- Ensure you have an internet connection for the initial load
- The page loads JSZip from a CDN (Content Delivery Network)
- Check browser console (F12) for specific errors

### Browser Compatibility

**Problem**: File downloads don't work

**Solution**:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript in your browser settings
- Check if your browser is blocking downloads
- Try a different browser

### File Selection Issues

**Problem**: Can't select files or "Choose File" button doesn't work

**Solution**:
- Make sure JavaScript is enabled
- Check browser console (F12) for errors
- Try refreshing the page
- Ensure file permissions allow reading the files

### McAddon Creation Fails

**Problem**: Error message when creating .mcaddon file

**Possible causes**:
- Base .mcaddon file is corrupted or invalid
- Base .mcaddon doesn't contain a behavior pack with manifest.json
- Recipe text file has formatting errors

**Solution**:
- Verify your base .mcaddon file is valid (test it in Minecraft)
- Check the recipe text file format matches the specification
- Review the error message for specific details

### Downloads Go to Wrong Folder

**Problem**: Can't find downloaded files

**Solution**:
- Check your browser's Downloads folder (usually `~/Downloads`)
- Check browser settings for default download location
- Look in browser's download manager (Ctrl+J in most browsers)
- Some browsers may prompt for save location

## Offline Usage

To use the web interface offline:

1. **Initial setup** (requires internet):
   - Open `minecraft_recipe.html` in your browser while online
   - The JSZip library will be loaded from the CDN
   - Most browsers will cache it automatically

2. **Offline usage**:
   - Once cached, the page should work offline
   - To ensure offline capability, you can modify the HTML to include JSZip locally instead of from CDN

### Making Fully Offline

To make the interface work without any internet connection:

1. Download JSZip library: https://github.com/Stuk/jszip
2. Save `jszip.min.js` in the same directory as `minecraft_recipe.html`
3. Edit `minecraft_recipe.html` and change:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
   ```
   to:
   ```html
   <script src="jszip.min.js"></script>
   ```

## Comparison with Other Versions

| Feature | Web Version | Python CLI | Python UI | Rust UI |
|---------|-------------|------------|-----------|---------|
| Platform | Any (browser) | Any (Python) | Unix-like | Cross-platform |
| Installation | None | Python 3.7+ | Python 3.7+ | Rust toolchain |
| Internet required | Initial load only | No | No | No |
| User interface | Modern web UI | Command line | Terminal TUI | Terminal TUI |
| File selection | Browser dialog | Command args | File browser | File browser |
| Output location | Downloads folder | Same as input | Same as input | Same as input |
| Processing | Client-side JS | Python script | Python script | Compiled binary |
| Best for | Casual users, no install | Automation, scripts | Interactive CLI | Windows users |

## Browser Developer Console

To view detailed error messages if something goes wrong:

- **Chrome/Edge**: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- **Firefox**: Press F12 or Ctrl+Shift+K (Cmd+Option+K on Mac)
- **Safari**: Enable Developer menu first (Preferences → Advanced → Show Develop menu), then press Cmd+Option+C

Look for red error messages in the Console tab.

## Technical Details

### RecipeParser Class

The JavaScript `RecipeParser` class is a direct port of the Python version, maintaining the same:
- Validation rules
- Error messages
- JSON output format
- Recipe file format requirements

### File Size Limits

Browser file handling typically works well for files up to several MB. For this use case:
- Recipe .txt files: Usually < 1 KB (no practical limit)
- McAddon files: Typically < 5 MB (well within browser capabilities)

### Browser Storage

The web interface does not use browser storage (localStorage, cookies, etc.). Each session is independent with no data persistence.

## License

See project license file for details.

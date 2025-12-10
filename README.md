# Minecraft Bedrock Recipe Generator

**Navigation:** [Overview](#overview) | [Components](#components) | [Quick Start](#quick-start) | [Recipe Format](#recipe-format) | [Output](#output) | [Documentation](#documentation)

A tool for converting text-based recipe definitions into JSON format for Minecraft Bedrock edition, with optional packaging into .mcaddon files.

## Overview

This project provides both command-line and interactive terminal UI tools to simplify the creation of crafting recipes for Minecraft Bedrock edition. Write recipes in a simple text format and convert them to the JSON format required by Minecraft.

## Components

### Python Script (`minecraft_recipe.py`)
Command-line tool that converts recipe text files to JSON format. Can optionally create .mcaddon addon packages with the recipe included.

**Requirements**: Python 3.7+ (standard library only, no external dependencies)

### Python Terminal UI (`minecraft_recipe_ui.py`)
Interactive curses-based terminal interface for the Python script. Provides directory browsing, file selection, and easy recipe conversion.

**Platform**: Unix-like systems (macOS, Linux)

See [README-PYTHON-UI.md](README-PYTHON-UI.md) for detailed Python documentation.

### Rust Terminal UI (`minecraft-recipe-ui`)
Cross-platform terminal UI built with Rust, providing the same functionality as the Python UI with support for Windows.

**Platform**: Cross-platform (macOS, Linux, Windows)

See [README-RUST-UI.md](README-RUST-UI.md) for detailed Rust documentation.

## Quick Start

### Command-line Usage

```bash
# Convert a recipe to JSON
python3 minecraft_recipe.py recipe.txt

# Convert and create .mcaddon file
python3 minecraft_recipe.py recipe.txt --mcaddon base.mcaddon
```

### Interactive UI

Python (macOS/Linux):
```bash
python3 minecraft_recipe_ui.py
```

Rust (all platforms):
```bash
cargo run --release
```

## Recipe Format

Recipe files are simple text files with the following structure:

```
namespace:item_identifier
ABC
DEF
GHI
A = namespace:ingredient1
B = namespace:ingredient2
...
count
```

Example (`sample.txt`):
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

- **Line 1**: Result item identifier (namespace:item format)
- **Lines 2-4**: 3x3 crafting pattern (use `-` for empty spaces)
- **Lines 5+**: Symbol definitions (SYMBOL = namespace:item)
- **Last line**: Output count (number of items produced)

## Output

The tools generate:
- **JSON file**: Recipe in Minecraft Bedrock format (same directory as input)
- **MCADDON file** (optional): Complete addon package with auto-incrementing serial numbers (e.g., `base_001.mcaddon`, `base_002.mcaddon`)

## Documentation

- [Python UI Documentation](README-PYTHON-UI.md) - Python implementation details, command-line usage, and troubleshooting
- [Rust UI Documentation](README-RUST-UI.md) - Rust implementation details, building, and cross-compilation

## License

See project license file for details.

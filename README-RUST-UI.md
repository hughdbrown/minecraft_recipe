# Minecraft Recipe UI

A terminal user interface (TUI) for the Minecraft Bedrock Recipe Generator.

## Overview

This Rust application provides an interactive terminal UI that wraps the `minecraft_recipe.py` Python script, making it easier to convert Minecraft recipe text files to JSON format.

## Prerequisites

- Rust (2024 edition or later)
- Python 3.7 or later (with standard library)
- The `minecraft_recipe.py` script in the same directory

No external Python dependencies are required - the script uses only Python's standard library.

## Building

```bash
cargo build --release
```

The compiled binary will be at `target/release/minecraft-recipe-ui`

### Cross-compilation for Windows

To build for Windows from macOS or Linux, see `CROSS_COMPILE.md` for detailed instructions.

## Running

### Interactive UI

Run during development:
```bash
cargo run
```

Or run the compiled binary directly:

```bash
./target/release/minecraft-recipe-ui
```

### Command-line Script

You can also use the Python script directly from the command line:

```bash
python3 minecraft_recipe.py <recipe_file.txt>
```

With optional .mcaddon file creation:

```bash
python3 minecraft_recipe.py <recipe_file.txt> --mcaddon <base.mcaddon>
```

Examples:

```bash
# Convert recipe to JSON only
python3 minecraft_recipe.py sample.txt

# Convert and create .mcaddon file
python3 minecraft_recipe.py sample.txt --mcaddon "Circuits & Machines (7).mcaddon"
```

## Usage

The application provides an interactive interface with the following components:

### UI Elements

1. **Directory Selector**: Browse and select the working directory containing your recipe files
   - Use Up/Down arrows to navigate
   - Press Enter to change to the selected directory
   - Shows parent directory (..) as first option

2. **Text File Selector**: Select the .txt recipe file to convert
   - Automatically selects if only one .txt file is present
   - Use Up/Down arrows to navigate

3. **McAddon Toggle**: Enable/disable .mcaddon file creation
   - Press Enter to toggle on/off
   - When enabled, creates a new .mcaddon file with the recipe included

4. **McAddon File Selector**: Select base .mcaddon file (only active when toggle is enabled)
   - Automatically selects if only one .mcaddon file is present
   - Use Up/Down arrows to navigate

5. **Go Button**: Execute the conversion
   - Press Enter to run the Python script with selected options

### Keyboard Controls

- **Tab**: Move to next widget
- **Shift+Tab**: Move to previous widget
- **Up/Down**: Navigate within lists
- **Enter**: Select item, toggle option, or activate button
- **q** or **Esc**: Quit the application

### Workflow

1. Launch the application - it starts in the current directory
2. Optionally navigate to a different directory using the Directory Selector
3. Select the .txt file you want to convert (pre-selected if only one exists)
4. Optionally enable the McAddon toggle and select a base .mcaddon file
5. Press Tab to navigate to the Go button and press Enter
6. View the result dialog showing success or error messages
7. Press Enter, q, or Esc to quit

## Result Dialog

After executing the conversion, a result screen shows:
- Success message with output file paths (for both .json and .mcaddon if applicable)
- Error messages if something went wrong
- Python script output

Press Enter, q, or Esc to exit the application.

## File Operations

The application invokes the Python script using:
```bash
python3 minecraft_recipe.py <txt_file> [--mcaddon <mcaddon_file>]
```

Output files are created in the same directory as the input .txt file:
- `.json` file with the recipe data
- `.mcaddon` file (if option enabled) with incrementing serial number (e.g., `base_001.mcaddon`, `base_002.mcaddon`, etc.)

## Dependencies

- `ratatui` v0.29 - Terminal UI framework
- `crossterm` v0.28 - Cross-platform terminal manipulation

## Architecture

The application consists of two main modules:

- `main.rs`: Application entry point, event loop, and input handling
- `ui.rs`: UI rendering and application state management

The UI uses ratatui's widget system to create an interactive terminal interface with proper keyboard navigation and visual feedback.

# Minecraft Recipe UI (Python)

An interactive terminal user interface for the Minecraft Bedrock Recipe Generator, implemented in Python using the curses library.

## Overview

This Python application provides the same functionality as the Rust `minecraft-recipe-ui`, offering an interactive terminal interface that wraps the `minecraft_recipe.py` script for easy conversion of Minecraft recipe text files to JSON format.

## Prerequisites

- Python 3.7 or later (with standard library)
- The `minecraft_recipe.py` script in the same directory

No external dependencies are required - both scripts use only Python's standard library.

## Running

### Interactive UI

```bash
python3 minecraft_recipe_ui.py
```

Or if you've made it executable:

```bash
./minecraft_recipe_ui.py
```

### Command-line Script

You can also run the recipe converter directly from the command line:

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
   - Automatically selects first .txt file if present
   - Use Up/Down arrows to navigate

3. **McAddon Toggle**: Enable/disable .mcaddon file creation
   - Press Enter to toggle on/off
   - When enabled, creates a new .mcaddon file with the recipe included

4. **McAddon File Selector**: Select base .mcaddon file (only active when toggle is enabled)
   - Automatically selects first .mcaddon file if present
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
3. Select the .txt file you want to convert (pre-selected if files exist)
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

## Implementation Details

### Architecture

The Python implementation uses:
- **curses**: Standard Python library for terminal UI rendering
- **subprocess**: For executing the minecraft_recipe.py script
- **pathlib**: For file system operations

The application consists of three main classes:
- `App`: Application state and logic
- `UI`: Terminal rendering using curses
- Helper functions for input handling and the main event loop

### Differences from Rust Version

While functionally equivalent, the Python version:
- Uses curses instead of ratatui/crossterm
- Has slightly different box-drawing characters (uses ASCII instead of Unicode)
- Requires no compilation step
- May have slightly different rendering on some terminals

### Terminal Compatibility

The application uses the curses library, which is widely supported on Unix-like systems (Linux, macOS). It should work in most terminal emulators including:
- Terminal.app (macOS)
- iTerm2 (macOS)
- gnome-terminal (Linux)
- konsole (Linux)
- xterm (Linux)

**Note**: Curses support on Windows is limited. Windows users should use the Rust version or run this in WSL (Windows Subsystem for Linux).

## Troubleshooting

### Import Error: No module named '_curses'

If you get a curses import error:
- On macOS: curses should be included with Python
- On Linux: Install the curses development package:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install python3-dev

  # Fedora
  sudo dnf install python3-devel
  ```

### Terminal Size Issues

If the UI doesn't render correctly:
- Ensure your terminal window is at least 80 columns wide and 24 rows tall
- Try resizing the terminal window
- Some elements may not display properly in very small terminals

## Comparison with Rust Version

| Feature | Python Version | Rust Version |
|---------|---------------|--------------|
| Platform | Unix-like (macOS, Linux) | Cross-platform (macOS, Linux, Windows) |
| Dependencies | Python 3.7+ standard library only | Rust, ratatui, crossterm |
| Installation | No compilation needed | Requires Rust toolchain |
| Performance | Fast enough for this use case | Slightly faster startup |
| File size | Script (~400 lines) | Compiled binary (~2-5 MB) |
| Distribution | Requires Python interpreter | Standalone executable |
| External deps | None (standard library only) | None at runtime (static binary) |

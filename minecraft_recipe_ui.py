#!/usr/bin/env python3
"""
Interactive terminal UI for Minecraft Recipe Converter.
Provides a user-friendly interface for converting recipe text files to JSON format.
"""

import curses
import os
import subprocess
import sys
from pathlib import Path
from typing import List, Optional


class FocusedWidget:
    """Enum-like class for tracking which widget has focus."""
    DIRECTORY = 0
    TXT_FILE = 1
    MCADDON_TOGGLE = 2
    MCADDON_FILE = 3
    GO_BUTTON = 4


class Screen:
    """Enum-like class for screen states."""
    MAIN = 0
    RESULT = 1


class App:
    """Main application state and logic."""

    def __init__(self):
        self.screen = Screen.MAIN
        self.focused_widget = FocusedWidget.DIRECTORY
        self.current_directory = Path.cwd()
        self.directories: List[Path] = []
        self.directory_selected = 0
        self.txt_files: List[Path] = []
        self.txt_file_selected = 0
        self.mcaddon_files: List[Path] = []
        self.mcaddon_file_selected = 0
        self.use_mcaddon = False
        self.result_message = ""

        self.load_directory_contents()

    def load_directory_contents(self):
        """Load directories and files from current directory."""
        # Load directories
        self.directories = []

        # Add parent directory if not at root
        parent = self.current_directory.parent
        if parent != self.current_directory:
            self.directories.append(parent)

        # Add subdirectories
        try:
            for entry in sorted(self.current_directory.iterdir()):
                if entry.is_dir():
                    self.directories.append(entry)
        except PermissionError:
            pass

        # Select first directory by default
        if self.directories:
            self.directory_selected = 0

        # Load .txt files
        self.txt_files = []
        try:
            for entry in sorted(self.current_directory.iterdir()):
                if entry.is_file() and entry.suffix == '.txt':
                    self.txt_files.append(entry)
        except PermissionError:
            pass

        # Auto-select first .txt file
        if self.txt_files:
            self.txt_file_selected = 0

        # Load .mcaddon files
        self.mcaddon_files = []
        try:
            for entry in sorted(self.current_directory.iterdir()):
                if entry.is_file() and entry.suffix == '.mcaddon':
                    self.mcaddon_files.append(entry)
        except PermissionError:
            pass

        # Auto-select first .mcaddon file
        if self.mcaddon_files:
            self.mcaddon_file_selected = 0

    def change_directory(self, new_dir: Path):
        """Change to a new directory and reload contents."""
        self.current_directory = new_dir
        self.load_directory_contents()

    def next_widget(self):
        """Move focus to next widget."""
        if self.focused_widget == FocusedWidget.DIRECTORY:
            self.focused_widget = FocusedWidget.TXT_FILE
        elif self.focused_widget == FocusedWidget.TXT_FILE:
            self.focused_widget = FocusedWidget.MCADDON_TOGGLE
        elif self.focused_widget == FocusedWidget.MCADDON_TOGGLE:
            if self.use_mcaddon:
                self.focused_widget = FocusedWidget.MCADDON_FILE
            else:
                self.focused_widget = FocusedWidget.GO_BUTTON
        elif self.focused_widget == FocusedWidget.MCADDON_FILE:
            self.focused_widget = FocusedWidget.GO_BUTTON
        elif self.focused_widget == FocusedWidget.GO_BUTTON:
            self.focused_widget = FocusedWidget.DIRECTORY

    def previous_widget(self):
        """Move focus to previous widget."""
        if self.focused_widget == FocusedWidget.DIRECTORY:
            self.focused_widget = FocusedWidget.GO_BUTTON
        elif self.focused_widget == FocusedWidget.TXT_FILE:
            self.focused_widget = FocusedWidget.DIRECTORY
        elif self.focused_widget == FocusedWidget.MCADDON_TOGGLE:
            self.focused_widget = FocusedWidget.TXT_FILE
        elif self.focused_widget == FocusedWidget.MCADDON_FILE:
            self.focused_widget = FocusedWidget.MCADDON_TOGGLE
        elif self.focused_widget == FocusedWidget.GO_BUTTON:
            if self.use_mcaddon:
                self.focused_widget = FocusedWidget.MCADDON_FILE
            else:
                self.focused_widget = FocusedWidget.MCADDON_TOGGLE

    def next_item(self):
        """Move selection down in current list."""
        if self.focused_widget == FocusedWidget.DIRECTORY and self.directories:
            self.directory_selected = (self.directory_selected + 1) % len(self.directories)
        elif self.focused_widget == FocusedWidget.TXT_FILE and self.txt_files:
            self.txt_file_selected = (self.txt_file_selected + 1) % len(self.txt_files)
        elif self.focused_widget == FocusedWidget.MCADDON_FILE and self.mcaddon_files:
            self.mcaddon_file_selected = (self.mcaddon_file_selected + 1) % len(self.mcaddon_files)

    def previous_item(self):
        """Move selection up in current list."""
        if self.focused_widget == FocusedWidget.DIRECTORY and self.directories:
            self.directory_selected = (self.directory_selected - 1) % len(self.directories)
        elif self.focused_widget == FocusedWidget.TXT_FILE and self.txt_files:
            self.txt_file_selected = (self.txt_file_selected - 1) % len(self.txt_files)
        elif self.focused_widget == FocusedWidget.MCADDON_FILE and self.mcaddon_files:
            self.mcaddon_file_selected = (self.mcaddon_file_selected - 1) % len(self.mcaddon_files)

    def execute_python_script(self):
        """Execute the minecraft_recipe.py script with selected options."""
        # Get selected .txt file
        if not self.txt_files or self.txt_file_selected >= len(self.txt_files):
            self.result_message = "Error: No .txt file selected"
            self.screen = Screen.RESULT
            return

        txt_file = self.txt_files[self.txt_file_selected]

        # Build command - use python3 to run the script directly
        script_path = Path(__file__).parent / "minecraft_recipe.py"
        cmd = [sys.executable, str(script_path), str(txt_file)]

        # Add mcaddon option if enabled
        if self.use_mcaddon:
            if not self.mcaddon_files or self.mcaddon_file_selected >= len(self.mcaddon_files):
                self.result_message = "Error: No .mcaddon file selected"
                self.screen = Screen.RESULT
                return

            mcaddon_file = self.mcaddon_files[self.mcaddon_file_selected]
            cmd.extend(["--mcaddon", str(mcaddon_file)])

        # Execute command
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)

            if result.returncode == 0:
                self.result_message = f"Success!\n\n{result.stdout}"
            else:
                self.result_message = f"Error:\n\n{result.stderr}"
        except FileNotFoundError:
            self.result_message = f"Error: Python executable '{sys.executable}' not found."
        except Exception as e:
            self.result_message = f"Failed to execute command: {e}"

        self.screen = Screen.RESULT


class UI:
    """Terminal UI renderer using curses."""

    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.setup_colors()
        curses.curs_set(0)  # Hide cursor

    def setup_colors(self):
        """Initialize color pairs."""
        curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_BLACK)    # Title
        curses.init_pair(2, curses.COLOR_YELLOW, curses.COLOR_BLACK)  # Focused border
        curses.init_pair(3, curses.COLOR_WHITE, curses.COLOR_BLACK)   # Normal
        curses.init_pair(4, curses.COLOR_BLACK, curses.COLOR_WHITE)   # Selected item
        curses.init_pair(5, curses.COLOR_GREEN, curses.COLOR_BLACK)   # Go button
        curses.init_pair(6, curses.COLOR_BLACK, curses.COLOR_BLACK)   # Disabled

    def draw_box(self, y, x, height, width, title, focused=False):
        """Draw a bordered box with optional title."""
        color = curses.color_pair(2) if focused else curses.color_pair(3)

        # Draw box
        for i in range(height):
            if i == 0 or i == height - 1:
                self.stdscr.addstr(y + i, x, "+" + "-" * (width - 2) + "+", color)
            else:
                self.stdscr.addstr(y + i, x, "|" + " " * (width - 2) + "|", color)

        # Draw title
        if title:
            title_str = f" {title} "
            if len(title_str) < width - 2:
                self.stdscr.addstr(y, x + 2, title_str, color | curses.A_BOLD)

    def draw_list(self, y, x, height, width, title, items, selected_idx, focused=False):
        """Draw a list widget."""
        self.draw_box(y, x, height, width, title, focused)

        # Calculate visible window
        visible_height = height - 2
        start_idx = max(0, selected_idx - visible_height + 1)
        end_idx = min(len(items), start_idx + visible_height)

        # Draw items
        for i, item in enumerate(items[start_idx:end_idx]):
            item_y = y + 1 + i
            is_selected = (start_idx + i) == selected_idx

            # Truncate item name if too long
            item_name = str(item.name) if hasattr(item, 'name') else str(item)
            max_width = width - 4
            if len(item_name) > max_width:
                item_name = item_name[:max_width - 3] + "..."

            prefix = "> " if is_selected else "  "

            if is_selected:
                self.stdscr.addstr(item_y, x + 1, prefix + item_name, curses.color_pair(4) | curses.A_BOLD)
            else:
                self.stdscr.addstr(item_y, x + 1, prefix + item_name, curses.color_pair(3))

    def draw_main_screen(self, app: App):
        """Draw the main application screen."""
        self.stdscr.clear()
        height, width = self.stdscr.getmaxyx()

        # Title
        title = "Minecraft Recipe Converter"
        self.stdscr.addstr(1, (width - len(title)) // 2, title,
                          curses.color_pair(1) | curses.A_BOLD)

        # Current directory
        dir_str = f"Directory: {app.current_directory}"
        if len(dir_str) > width - 4:
            dir_str = "Directory: ..." + str(app.current_directory)[-width+18:]
        self.stdscr.addstr(2, 2, dir_str, curses.color_pair(3))

        current_y = 4

        # Directory selector
        dir_items = []
        for d in app.directories:
            if d == app.current_directory.parent and d != app.current_directory:
                dir_items.append(type('obj', (object,), {'name': '.. (parent)'})())
            else:
                dir_items.append(d)

        list_height = min(8, len(dir_items) + 2)
        self.draw_list(current_y, 2, list_height, width - 4,
                      "Select Directory", dir_items, app.directory_selected,
                      app.focused_widget == FocusedWidget.DIRECTORY)
        current_y += list_height + 1

        # Txt file selector
        list_height = min(8, len(app.txt_files) + 2)
        self.draw_list(current_y, 2, list_height, width - 4,
                      "Select .txt file", app.txt_files, app.txt_file_selected,
                      app.focused_widget == FocusedWidget.TXT_FILE)
        current_y += list_height + 1

        # Mcaddon toggle
        toggle_text = "[X] Use .mcaddon file" if app.use_mcaddon else "[ ] Use .mcaddon file"
        self.draw_box(current_y, 2, 3, width - 4, "",
                     app.focused_widget == FocusedWidget.MCADDON_TOGGLE)
        self.stdscr.addstr(current_y + 1, 4, toggle_text, curses.color_pair(3))
        current_y += 4

        # Mcaddon file selector
        if app.use_mcaddon:
            list_height = min(8, len(app.mcaddon_files) + 2)
            self.draw_list(current_y, 2, list_height, width - 4,
                          "Select .mcaddon file", app.mcaddon_files,
                          app.mcaddon_file_selected,
                          app.focused_widget == FocusedWidget.MCADDON_FILE)
        else:
            list_height = 3
            self.draw_box(current_y, 2, list_height, width - 4, "Select .mcaddon file", False)
            self.stdscr.addstr(current_y + 1, 4, "(disabled)", curses.color_pair(6))
        current_y += list_height + 1

        # Go button
        go_color = curses.color_pair(5)
        if app.focused_widget == FocusedWidget.GO_BUTTON:
            go_color |= curses.A_BOLD

        self.draw_box(current_y, 2, 3, width - 4, "",
                     app.focused_widget == FocusedWidget.GO_BUTTON)
        go_text = "[ GO ]"
        self.stdscr.addstr(current_y + 1, (width - len(go_text)) // 2, go_text, go_color)
        current_y += 4

        # Instructions
        instructions = "Tab: Next | Shift+Tab: Prev | Enter: Select | Up/Down: Navigate | q/Esc: Quit"
        if current_y < height - 1:
            self.stdscr.addstr(height - 2, 2, instructions[:width-4], curses.color_pair(3))

        self.stdscr.refresh()

    def draw_result_screen(self, app: App):
        """Draw the result screen."""
        self.stdscr.clear()
        height, width = self.stdscr.getmaxyx()

        # Result box
        result_height = height - 4
        self.draw_box(1, 2, result_height, width - 4, "Result", False)

        # Display result message (with wrapping)
        lines = app.result_message.split('\n')
        current_y = 2
        for line in lines:
            if current_y >= result_height - 1:
                break
            # Wrap long lines
            while len(line) > width - 6 and current_y < result_height - 1:
                self.stdscr.addstr(current_y, 4, line[:width-6], curses.color_pair(3))
                line = line[width-6:]
                current_y += 1
            if current_y < result_height - 1:
                self.stdscr.addstr(current_y, 4, line[:width-6], curses.color_pair(3))
                current_y += 1

        # Instructions
        instructions = "Press Enter, q, or Esc to quit"
        self.stdscr.addstr(height - 2, 2, instructions, curses.color_pair(3))

        self.stdscr.refresh()

    def draw(self, app: App):
        """Draw the appropriate screen based on app state."""
        if app.screen == Screen.MAIN:
            self.draw_main_screen(app)
        elif app.screen == Screen.RESULT:
            self.draw_result_screen(app)


def handle_main_screen_input(app: App, key: int) -> bool:
    """Handle keyboard input for main screen. Returns True to quit."""
    if key in (ord('q'), ord('Q'), 27):  # q or Esc
        return True
    elif key == 9:  # Tab
        app.next_widget()
    elif key == curses.KEY_BTAB:  # Shift+Tab
        app.previous_widget()
    elif key == curses.KEY_UP:
        app.previous_item()
    elif key == curses.KEY_DOWN:
        app.next_item()
    elif key in (10, 13, curses.KEY_ENTER):  # Enter
        if app.focused_widget == FocusedWidget.DIRECTORY:
            if app.directories and app.directory_selected < len(app.directories):
                app.change_directory(app.directories[app.directory_selected])
        elif app.focused_widget == FocusedWidget.MCADDON_TOGGLE:
            app.use_mcaddon = not app.use_mcaddon
        elif app.focused_widget == FocusedWidget.GO_BUTTON:
            app.execute_python_script()

    return False


def handle_result_screen_input(app: App, key: int) -> bool:
    """Handle keyboard input for result screen. Returns True to quit."""
    if key in (ord('q'), ord('Q'), 27, 10, 13, curses.KEY_ENTER):  # q, Esc, or Enter
        return True
    return False


def run_app(stdscr):
    """Main application loop."""
    app = App()
    ui = UI(stdscr)

    while True:
        ui.draw(app)

        try:
            key = stdscr.getch()
        except KeyboardInterrupt:
            break

        if app.screen == Screen.MAIN:
            if handle_main_screen_input(app, key):
                break
        elif app.screen == Screen.RESULT:
            if handle_result_screen_input(app, key):
                break


def main():
    """Entry point."""
    try:
        curses.wrapper(run_app)
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()

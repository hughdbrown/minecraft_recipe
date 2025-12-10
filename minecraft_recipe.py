#!/usr/bin/env python3
"""
Minecraft Bedrock Recipe Generator
Converts text recipe definitions to JSON format for Minecraft Bedrock edition.
"""

import argparse
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from zipfile import ZipFile, ZIP_STORED


class RecipeParser:
    """Parse and validate Minecraft recipe text files."""

    def __init__(self, content: str):
        self.lines = [line.rstrip() for line in content.strip().split('\n')]
        self.result_identifier = None
        self.pattern = []
        self.substitutions = {}
        self.count = None

    def parse(self) -> None:
        """Parse the recipe file content."""
        if len(self.lines) < 5:
            raise ValueError(f"Recipe file must have at least 5 lines (found {len(self.lines)})")

        # Line 1: result identifier
        self.result_identifier = self.lines[0].strip()
        if not self._is_valid_identifier(self.result_identifier):
            raise ValueError(f"Invalid result identifier: {self.result_identifier}")

        # Lines 2-4: pattern
        self.pattern = self.lines[1:4]
        for i, line in enumerate(self.pattern, start=2):
            if len(line) != 3:
                raise ValueError(f"Line {i} pattern must be exactly 3 characters (found {len(line)})")

        # Parse substitutions and count
        self._parse_substitutions_and_count()

        # Validate all pattern symbols have substitutions
        self._validate_pattern_symbols()

    def _parse_substitutions_and_count(self) -> None:
        """Parse substitution lines and the count line."""
        substitution_lines = self.lines[4:]

        if not substitution_lines:
            raise ValueError("Missing substitution lines and count")

        # Last line should be count
        try:
            self.count = int(substitution_lines[-1])
            if self.count <= 0:
                raise ValueError(f"Count must be positive (found {self.count})")
        except ValueError as e:
            if "invalid literal" in str(e):
                raise ValueError(f"Last line must be a valid integer count: {substitution_lines[-1]}")
            raise

        # Parse substitutions
        for i, line in enumerate(substitution_lines[:-1], start=5):
            line = line.strip()
            if not line:
                continue

            parts = line.split('=', 1)
            if len(parts) != 2:
                raise ValueError(f"Line {i}: Invalid substitution format (expected 'SYMBOL = namespace:item')")

            symbol = parts[0].strip()
            item = parts[1].strip()

            if len(symbol) != 1:
                raise ValueError(f"Line {i}: Symbol must be a single character (found '{symbol}')")

            if not self._is_valid_identifier(item):
                raise ValueError(f"Line {i}: Invalid item identifier: {item}")

            if symbol in self.substitutions:
                raise ValueError(f"Line {i}: Duplicate symbol '{symbol}'")

            self.substitutions[symbol] = item

    def _validate_pattern_symbols(self) -> None:
        """Ensure all symbols in pattern have substitutions."""
        pattern_symbols = set()
        for line in self.pattern:
            for char in line:
                if char != '-':
                    pattern_symbols.add(char)

        missing = pattern_symbols - set(self.substitutions.keys())
        if missing:
            raise ValueError(f"Pattern symbols without substitutions: {', '.join(sorted(missing))}")

    @staticmethod
    def _is_valid_identifier(identifier: str) -> bool:
        """Validate namespace:item format."""
        if ':' not in identifier:
            return False
        parts = identifier.split(':')
        return len(parts) == 2 and all(part.strip() for part in parts)

    def to_json(self) -> dict:
        """Convert parsed recipe to Minecraft Bedrock JSON format."""
        # Convert pattern, replacing '-' with space
        json_pattern = [line.replace('-', ' ') for line in self.pattern]

        # Build key dictionary
        key = {}
        for symbol, item in self.substitutions.items():
            key[symbol] = {"item": item}

        return {
            "format_version": "1.20.0",
            "minecraft:recipe_shaped": {
                "description": {
                    "identifier": self.result_identifier
                },
                "tags": [
                    "crafting_table"
                ],
                "pattern": json_pattern,
                "key": key,
                "result": {
                    "item": self.result_identifier,
                    "count": self.count
                }
            }
        }


def find_next_serial_number(base_path: Path, base_name: str) -> int:
    """Find the next available serial number for mcaddon files."""
    pattern = re.compile(rf"^{re.escape(base_name)}_(\d{{3}})\.mcaddon$")
    max_serial = 0

    for file in base_path.iterdir():
        if match := pattern.match(file.name):
            serial = int(match.group(1))
            max_serial = max(max_serial, serial)

    return max_serial + 1


def create_mcaddon_with_recipe(
    input_file: Path,
    recipe_json: dict,
    base_mcaddon: Path
) -> Path:
    """
    Create a new .mcaddon file based on an existing one, adding the recipe JSON.

    Args:
        input_file: The input text file (used for naming)
        recipe_json: The recipe JSON to add
        base_mcaddon: The base .mcaddon file to clone

    Returns:
        Path to the created .mcaddon file
    """
    # Determine base name and find next serial number
    base_name = base_mcaddon.stem
    if base_name.endswith('.mcaddon'):
        base_name = base_name[:-8]  # Remove .mcaddon if it's part of stem

    output_dir = input_file.parent
    next_serial = find_next_serial_number(output_dir, base_name)
    output_mcaddon = output_dir / f"{base_name}_{next_serial:03d}.mcaddon"

    # Recipe filename based on input file stem
    recipe_filename = f"{input_file.stem}.json"

    # Create new mcaddon by copying base and adding recipe
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)

        # Extract base mcaddon
        with ZipFile(base_mcaddon, 'r') as zip_in:
            zip_in.extractall(temp_path)

        # Find the behavior pack directory (contains manifest.json and recipes/)
        behavior_pack = None
        for item in temp_path.iterdir():
            if item.is_dir():
                manifest = item / 'manifest.json'
                if manifest.exists():
                    # Check if this is the behavior pack (has recipes/ or should have it)
                    # Behavior packs typically have "type": "data" in modules
                    try:
                        with manifest.open() as f:
                            manifest_data = json.load(f)
                            for module in manifest_data.get('modules', []):
                                if module.get('type') == 'data':
                                    behavior_pack = item
                                    break
                    except (json.JSONDecodeError, KeyError):
                        pass

                    if behavior_pack:
                        break

        if not behavior_pack:
            raise ValueError(f"Could not find behavior pack in {base_mcaddon}")

        # Ensure recipes directory exists
        recipes_dir = behavior_pack / 'recipes'
        recipes_dir.mkdir(exist_ok=True)

        # Write recipe JSON
        recipe_file = recipes_dir / recipe_filename
        with recipe_file.open('w') as f:
            json.dump(recipe_json, f, indent=2)

        # Create new mcaddon (zip file)
        with ZipFile(output_mcaddon, 'w', ZIP_STORED) as zip_out:
            for file in temp_path.rglob('*'):
                if file.is_file():
                    arcname = file.relative_to(temp_path)
                    zip_out.write(file, arcname)

    return output_mcaddon


def main() -> None:
    """
    Convert Minecraft recipe text file to JSON format.

    Output will be written to the same directory with .json extension.
    If --mcaddon is provided, also creates a new .mcaddon file with the recipe added.
    """
    parser = argparse.ArgumentParser(
        description='Convert Minecraft recipe text file to JSON format.'
    )
    parser.add_argument(
        'input_file',
        type=Path,
        help='Path to the recipe text file'
    )
    parser.add_argument(
        '--mcaddon',
        type=Path,
        help='Base .mcaddon file to clone and add recipe to'
    )

    args = parser.parse_args()

    # Validate input file exists
    if not args.input_file.exists():
        print(f"Error: Input file '{args.input_file}' does not exist", file=sys.stderr)
        sys.exit(1)

    # Validate mcaddon file exists if provided
    if args.mcaddon and not args.mcaddon.exists():
        print(f"Error: .mcaddon file '{args.mcaddon}' does not exist", file=sys.stderr)
        sys.exit(1)

    try:
        # Read input file
        content = args.input_file.read_text()

        # Parse recipe
        recipe_parser = RecipeParser(content)
        recipe_parser.parse()

        # Generate JSON
        recipe_json = recipe_parser.to_json()

        # Determine output file
        output_file = args.input_file.with_suffix('.json')

        # Write JSON output
        with output_file.open('w') as f:
            json.dump(recipe_json, f, indent=2)

        print(f"Successfully created: {output_file}")

        # If mcaddon option provided, create new mcaddon file
        if args.mcaddon:
            output_mcaddon = create_mcaddon_with_recipe(args.input_file, recipe_json, args.mcaddon)
            print(f"Successfully created: {output_mcaddon}")

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(2)


if __name__ == '__main__':
    main()

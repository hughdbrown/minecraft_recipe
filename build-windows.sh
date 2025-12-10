#!/usr/bin/env bash
# Build script for cross-compiling to Windows

set -e

echo "Building for Windows (x86_64-pc-windows-gnu)..."
cargo build --release --target x86_64-pc-windows-gnu

echo ""
echo "Build complete!"
echo "Windows executable: target/x86_64-pc-windows-gnu/release/minecraft-recipe-ui.exe"
echo ""
echo "File info:"
file target/x86_64-pc-windows-gnu/release/minecraft-recipe-ui.exe
ls -lh target/x86_64-pc-windows-gnu/release/minecraft-recipe-ui.exe

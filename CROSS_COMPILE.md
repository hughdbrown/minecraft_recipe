# Cross-Compiling to Windows

This guide explains how to cross-compile the Rust project to Windows executables from macOS or Linux.

## Prerequisites

### Option 1: Using MinGW (Recommended for macOS/Linux)

1. Install the Windows GNU toolchain:

   **On macOS (using Homebrew):**
   ```bash
   brew install mingw-w64
   ```

   **On Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get install mingw-w64
   ```

2. Add the Rust Windows target:
   ```bash
   rustup target add x86_64-pc-windows-gnu
   ```

### Option 2: Using MSVC toolchain (More Complex)

For the MSVC target, you'll need:
```bash
rustup target add x86_64-pc-windows-msvc
```

And either:
- Build on Windows with Visual Studio installed, OR
- Use `xwin` to download Windows SDK headers on Linux/macOS

## Building for Windows

### Using MinGW (x86_64-pc-windows-gnu)

```bash
cargo build --release --target x86_64-pc-windows-gnu
```

The Windows executable will be at:
```
target/x86_64-pc-windows-gnu/release/minecraft-recipe-ui.exe
```

### Using MSVC (x86_64-pc-windows-msvc)

```bash
cargo build --release --target x86_64-pc-windows-msvc
```

The Windows executable will be at:
```
target/x86_64-pc-windows-msvc/release/minecraft-recipe-ui.exe
```

## Troubleshooting

### MinGW linker not found

If you get an error about `x86_64-w64-mingw32-gcc` not being found:
- Make sure mingw-w64 is installed
- Verify the linker is in your PATH: `which x86_64-w64-mingw32-gcc`

### Dependencies not building

The dependencies (`ratatui` and `crossterm`) should work fine for Windows targets as they're cross-platform. If you encounter issues:
- Make sure you have the latest version of Rust: `rustup update`
- Clean the build cache: `cargo clean`

## Testing the Windows Executable

To test the Windows executable:
1. Copy it to a Windows machine
2. Run it from PowerShell or CMD: `.\minecraft-recipe-ui.exe`

Or use Wine on macOS/Linux:
```bash
wine target/x86_64-pc-windows-gnu/release/minecraft-recipe-ui.exe
```

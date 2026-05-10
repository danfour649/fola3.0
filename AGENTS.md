# AGENTS.md

## Cursor Cloud specific instructions

This is a single-file Node.js CLI tool (`scripts/resize-image.js`) that resizes images to a target file size using ImageMagick. See `README.md` for usage.

### Dependencies

- **Node.js >= 18** (pre-installed in the VM)
- **ImageMagick** must be installed as a system package (`sudo apt-get install -y imagemagick`). The script invokes the `magick` command, but Ubuntu's ImageMagick 6 package provides `convert` instead. A symlink at `/usr/local/bin/magick` pointing to `/usr/bin/convert` is required.

### Running the CLI

```bash
npm run resize-image -- <inputFile> <sizeMB> [minQuality]
```

### Known issue

The script has a pre-existing bug on Linux: `execSync` in `runMagick()` (line 85) receives an array argument instead of a string on non-Windows platforms. This causes a `TypeError: The "command" argument must be of type string. Received an instance of Array` at runtime. The environment itself (Node.js + ImageMagick) is correctly set up — the bug is in the application code.

### No lint, test, or build

This project has no linter, test framework, or build step configured. There are no `devDependencies`. The only npm script is `resize-image`.

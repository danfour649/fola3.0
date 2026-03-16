# fola3.0

CLI to resize images to a target file size using ImageMagick. Scales the image as needed and adjusts JPEG quality to hit the target size.

## Requirements

- **Node.js** 18+
- **ImageMagick** installed and on `PATH`, or set `IMAGEMAGICK_PATH` to the ImageMagick directory (e.g. on Windows: `C:\Program Files\ImageMagick-7.x.x`)

## Install

```bash
npm install
```

Or install globally to use the `resize-image` command anywhere:

```bash
npm install -g
```

## Usage

```bash
# Via npm script
npm run resize-image -- <inputFile> <sizeMB> [minQuality]

# Or, if installed globally or via npx
resize-image <inputFile> <sizeMB> [minQuality]
```

- **inputFile** – Path to the image (e.g. `Gemini_beach_20260315A.png`)
- **sizeMB** – Target file size in MB (e.g. `4.2`)
- **minQuality** – (optional) Minimum JPEG quality 1–100; default `1`

Output is written next to the input file with a `_resized` suffix before the extension.

### Example

```bash
npm run resize-image -- Gemini_beach_20260315A.png 4.2
```

## License

MIT

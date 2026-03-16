#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
function getMagickPath() {
  if (process.env.IMAGEMAGICK_PATH) {
    const p = path.join(process.env.IMAGEMAGICK_PATH, 'magick.exe');
    if (fs.existsSync(p)) return { exe: p, dir: process.env.IMAGEMAGICK_PATH };
  }
  if (process.platform === 'win32') {
    const programFiles = [
      process.env['ProgramFiles'] || 'C:\\Program Files',
      process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
    ];
    for (const pf of programFiles) {
      if (!fs.existsSync(pf)) continue;
      const dirs = fs.readdirSync(pf);
      const im = dirs.find((d) => d.startsWith('ImageMagick'));
      if (im) {
        const dir = path.join(pf, im);
        const exe = path.join(dir, 'magick.exe');
        if (fs.existsSync(exe)) return { exe, dir };
      }
    }
  }
  return { exe: 'magick', dir: null };
}

const { exe: magick, dir: magickDir } = getMagickPath();
const args = process.argv.slice(2);
const inputFile = args[0];
const sizeMB = args[1];
const minQuality = args[2] != null ? parseInt(args[2], 10) : 1;

if (!inputFile || !sizeMB) {
  console.error('Usage: npm run resize-image -- <inputFile> <sizeMB> [minQuality]');
  console.error('  Output matches target file size (~sizeMB). Scales image up if needed, then adjusts quality.');
  console.error('  minQuality = 1–100 (optional). Minimum JPEG quality; default 1.');
  console.error('Example: npm run resize-image -- Gemini_beach_20260315A.png 4.2');
  process.exit(1);
}

const sizeNum = parseFloat(sizeMB);
if (Number.isNaN(sizeNum) || sizeNum <= 0) {
  console.error('Error: sizeMB must be a positive number (e.g. 4.6)');
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputFile);
if (!fs.existsSync(inputPath)) {
  console.error('Error: input file not found:', inputPath);
  process.exit(1);
}

const dir = path.dirname(inputPath);
const ext = path.extname(inputPath);
const base = path.basename(inputPath, ext);
const outputName = `${base}_resize${sizeMB}mb.jpg`;
const outputPath = path.join(dir, outputName);

const targetBytes = Math.round(sizeNum * 1024 * 1024);
const tolerance = 0.08;

console.log('Targeting ~' + sizeMB + ' MB');
console.log(inputFile, '->', outputName);

const execOpts = { stdio: 'pipe' };
if (magickDir) {
  const sep = process.platform === 'win32' ? ';' : ':';
  execOpts.env = { ...process.env, PATH: magickDir + sep + process.env.PATH };
}

function quoteArg(a) {
  if (process.platform !== 'win32') return a;
  return '"' + String(a).replace(/"/g, '""') + '"';
}

function runMagick(scalePctNum, quality) {
  const scaleStr = Math.round(scalePctNum * 100) + '%';
  const args = [magick, inputPath, '-scale', scaleStr, '-quality', String(quality), outputPath];
  if (process.platform === 'win32' && magickDir) {
    const cmd = args.map(quoteArg).join(' ');
    execSync(cmd, { ...execOpts, shell: true });
  } else {
    execSync(args, execOpts);
  }
}

try {
  let scalePctNum = 1.0;
  runMagick(scalePctNum, 100);
  let bytesAtQ100 = fs.statSync(outputPath).size;

  if (bytesAtQ100 < targetBytes) {
    let lowS = 1.0;
    let highS = 4.0;
    for (let i = 0; i < 15; i++) {
      const midS = (lowS + highS) / 2;
      runMagick(midS, 100);
      const sz = fs.statSync(outputPath).size;
      if (sz >= targetBytes) highS = midS;
      else lowS = midS;
    }
    scalePctNum = highS;
    runMagick(scalePctNum, 100);
    console.log('Scaled up to', (scalePctNum * 100).toFixed(0) + '% to reach target size');
  }

  let low = minQuality >= 1 && minQuality <= 100 ? minQuality : 1;
  let high = 100;
  let bestQ = 90;
  const maxIter = 20;

  for (let i = 0; i < maxIter; i++) {
    const q = Math.round((low + high) / 2);
    runMagick(scalePctNum, q);
    const bytes = fs.statSync(outputPath).size;

    if (bytes >= targetBytes * (1 - tolerance) && bytes <= targetBytes * (1 + tolerance)) {
      bestQ = q;
      break;
    }
    if (i === maxIter - 1) bestQ = q;
    else if (bytes < targetBytes) low = q + 1;
    else high = q - 1;
  }

  const finalBytes = fs.statSync(outputPath).size;
  const finalMB = (finalBytes / (1024 * 1024)).toFixed(2);
  console.log('Done:', outputPath, '(' + finalMB + ' MB, scale ' + (scalePctNum * 100).toFixed(0) + '%, quality ' + bestQ + ')');
} catch (err) {
  console.error('ImageMagick failed. Tried:', magick);
  if (err.stderr) console.error(err.stderr.toString());
  if (err.message) console.error(err.message);
  if (magickDir) console.error('ImageMagick dir:', magickDir);
  process.exit(1);
}

// Compresses images in public/ in place (same filename, no code changes needed) and
// writes a sibling .webp for <picture> to prefer. Run: node scripts/optimize-images.mjs
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGET_DIRS = ["public/images", "public/ProductImages"];
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 75;

async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImages(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function optimize(file) {
  const before = (await stat(file)).size;
  const ext = path.extname(file).toLowerCase();
  const buffer = await sharp(file).rotate().toBuffer();
  const image = sharp(buffer).resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });

  const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
  await image.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);

  if (ext === ".png") {
    await image.clone().png({ quality: 80, compressionLevel: 9 }).toFile(file + ".tmp");
  } else {
    await image.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(file + ".tmp");
  }

  const { rename } = await import("node:fs/promises");
  await rename(file + ".tmp", file);

  const after = (await stat(file)).size;
  const webpSize = (await stat(webpPath)).size;
  console.log(
    `${path.relative(ROOT, file)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (webp ${(webpSize / 1024).toFixed(0)}KB)`
  );
}

for (const dir of TARGET_DIRS) {
  const absDir = path.join(ROOT, dir);
  const files = await collectImages(absDir);
  for (const file of files) {
    await optimize(file);
  }
}

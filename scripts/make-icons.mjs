// Generates PWA icons (192x192 and 512x512 PNGs) directly from the real
// Government of Madhya Pradesh emblem (public/mp-emblem.jpeg), padded onto
// a white square canvas so the full circular seal is preserved without
// being cropped by OS icon masking.
import sharp from "sharp";
import path from "node:path";
import { mkdirSync } from "node:fs";

const SRC = path.join(process.cwd(), "public", "mp-emblem.jpeg");
const OUT_DIR = path.join(process.cwd(), "public", "icons");
mkdirSync(OUT_DIR, { recursive: true });

async function makeIcon(size) {
  const inner = Math.round(size * 0.86); // small margin so nothing touches the edge
  const emblem = await sharp(SRC)
    .resize(inner, inner, { kernel: sharp.kernel.lanczos3 })
    .sharpen()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: emblem, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_DIR, `icon-${size}.png`));

  console.log(`wrote public/icons/icon-${size}.png`);
}

for (const size of [192, 512]) {
  await makeIcon(size);
}

// Regenerate public/og-default.png from public/favicon.svg.
// Run with: node scripts/generate-og.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const WIDTH = 1200;
const HEIGHT = 627;
const LOGO_HEIGHT = 420;

const svg = await readFile("public/favicon.svg");
const logo = await sharp(svg)
  .resize({ height: LOGO_HEIGHT })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toFile("public/og-default.png");

console.log(`Generated public/og-default.png (${WIDTH}x${HEIGHT})`);

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'banners');

// Brand colors
const BLUE = '#0652e9';
const CYAN = '#62e1e9';
const WHITE = '#ffffff';

// Banner definitions
const BANNERS = [
  {
    key: 'headline',
    title: 'BigConfig now supports',
    subtitle: 'Clojure · TypeScript · Python',
  },
  {
    key: 'idea-1',
    title: 'Coding agents are changing the game.',
    subtitle: 'Supporting multiple languages is no longer a problem.',
  },
  {
    key: 'idea-2',
    title: 'Write packages in the language you know best.',
    subtitle: 'Your coding agent maintains every implementation.',
  },
  {
    key: 'idea-3',
    title: 'Config files are the test.',
    subtitle: 'Every implementation verified against rendered output.',
  },
  {
    key: 'idea-4',
    title: 'Share config across implementations.',
    subtitle: 'One configuration — every language.',
  },
  {
    key: 'idea-5',
    title: 'Simpler than CDK and Pulumi.',
    subtitle: 'Define infrastructure packages in any language.',
  },
];

function backgroundDefs() {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${WHITE}"/>
        <stop offset="45%" stop-color="${WHITE}"/>
        <stop offset="100%" stop-color="${BLUE}"/>
      </linearGradient>
      <linearGradient id="textFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${BLUE}"/>
        <stop offset="70%" stop-color="${BLUE}"/>
        <stop offset="100%" stop-color="${WHITE}"/>
      </linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
      </linearGradient>
    </defs>`;
}

function geometricAccents(w, h) {
  let s = '';
  const cxs = [w * 0.85, w * 0.7, w * 0.35, w * 0.2];
  const cys = [h * 0.15, h * 0.85, -h * 0.1, h * 0.5];
  const rs = [w * 0.14, w * 0.11, w * 0.1, w * 0.06];
  const fills = [CYAN, WHITE, BLUE, CYAN];
  const ops = [0.06, 0.05, 0.05, 0.04];
  for (let i = 0; i < 4; i++) {
    s += `    <circle cx="${cxs[i]}" cy="${cys[i]}" r="${rs[i]}" fill="${fills[i]}" opacity="${ops[i]}"/>\n`;
  }

  // Diagonal lines
  for (let i = 0; i < 10; i++) {
    const x1 = (w / 12) * i * 0.8;
    const x2 = (w / 12) * (i + 2) * 0.8;
    const op = 0.04 + (i % 3) * 0.02;
    const col = i % 2 === 0 ? BLUE : CYAN;
    s += `    <line x1="${x1}" y1="0" x2="${x2}" y2="${h}" stroke="${col}" stroke-width="1" opacity="${op}"/>\n`;
  }

  // Wave paths
  s += `    <path d="M 0,${h * 0.88} Q ${w * 0.25},${h * 0.7} ${w * 0.5},${h * 0.82} T ${w},${h * 0.72}" fill="none" stroke="${BLUE}" stroke-width="1" opacity="0.06"/>\n`;
  s += `    <path d="M 0,${h * 0.93} Q ${w * 0.25},${h * 0.75} ${w * 0.5},${h * 0.87} T ${w},${h * 0.78}" fill="none" stroke="${CYAN}" stroke-width="1" opacity="0.08"/>\n`;

  return s;
}

function bigconfigLogo(x, y, s) {
  return `
    <g transform="translate(${x}, ${y}) scale(${s})">
      <g transform="matrix(2.6788,0,0,2.6788,-299.1,-331.55)">
        <g transform="translate(-5.8594,18.48)">
          <path fill="${BLUE}" d="m 165.23047,182.66406 v 8.30078 L 127.63672,173.5 v -6.73438 l 37.59375,-17.46875 v 8.30469 l -28.42969,12.45313 v 0.15625 z m 22.32812,-42.58984 H 124.6875 c -2.96875,0 -5.375,2.40625 -5.375,5.375 v 49.36719 c 0,2.96875 2.40625,5.375 5.375,5.375 h 45.41797 l 17.45312,-60.11719" fill-opacity="1" fill-rule="nonzero"/>
        </g>
        <g transform="translate(-5.8594,18.48)">
          <path fill="${CYAN}" d="m 247.37891,142.21094 -37.59375,17.23047 v -8.30469 l 29.05468,-12.45313 v -0.15625 l -29.05468,-12.45312 v -8.30078 l 37.59375,17.23047 z m -42.36719,-33.66406 -17.45313,60.11718 h 62.76953 c 2.96485,0 5.3711,-2.40625 5.3711,-5.375 v -49.36718 c 0,-2.96875 -2.40625,-5.375 -5.3711,-5.375 h -45.3164" fill-opacity="1" fill-rule="nonzero"/>
        </g>
      </g>
      <text x="195" y="90" font-family="Now" font-weight="bold" font-size="72px" fill="${BLUE}" letter-spacing="1">BIGCONFIG</text>
    </g>`;
}

function createLinkedInSVG(banner) {
  const w = 1584, h = 396;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
${backgroundDefs()}
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
${geometricAccents(w, h)}
  <rect x="${w * 0.5}" y="0" width="${w * 0.5}" height="5" fill="url(#glow)" opacity="0.4"/>
  ${bigconfigLogo(50, 50, 0.55)}
  <text font-family="Now" font-weight="600" font-size="18" fill="${BLUE}" opacity="0.45" text-anchor="end">
    <tspan x="${w - 40}" y="${h - 35}">bigconfig.ai</tspan>
  </text>
  <text font-family="Now" font-weight="bold" font-size="40" fill="url(#textFade)" text-anchor="end" letter-spacing="0.5">
    <tspan x="${w - 40}" y="${h * 0.50}">${banner.title}</tspan>
    <tspan x="${w - 40}" y="${h * 0.70}" font-size="24" font-weight="500" fill="${banner.subtitle.includes('·') ? BLUE : WHITE}">${banner.subtitle}</tspan>
  </text>
</svg>`;
}

function createXSVG(banner) {
  const w = 1200, h = 675;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
${backgroundDefs()}
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
${geometricAccents(w, h)}
  <rect x="${w * 0.4}" y="0" width="${w * 0.6}" height="4" fill="url(#glow)" opacity="0.4"/>
  ${bigconfigLogo(40, 30, 0.45)}
  <text font-family="Now" font-weight="bold" font-size="50" fill="${BLUE}" text-anchor="middle" letter-spacing="0.5">
    <tspan x="${w * 0.5}" y="${h * 0.42}">${banner.title}</tspan>
    <tspan x="${w * 0.5}" y="${h * 0.54}" font-size="28" font-weight="500" fill="${BLUE}" opacity="0.85">${banner.subtitle}</tspan>
  </text>
  <text font-family="Now" font-weight="600" font-size="18" fill="${BLUE}" opacity="0.45" text-anchor="end">
    <tspan x="${w - 40}" y="${h - 35}">bigconfig.ai</tspan>
  </text>
</svg>`;
}

async function renderPNG(svgPath, pngPath, width, height) {
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  await sharp(Buffer.from(svgContent))
    .resize(width, height)
    .png()
    .toFile(pngPath);
  console.log(`  ✓ ${path.basename(pngPath)} (${width}×${height})`);
}

async function main() {
  console.log('Generating banners...\n');

  for (const banner of BANNERS) {
    const dir = path.join(OUT, banner.key);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[${banner.key}] ${banner.title}`);

    const liSvgPath = path.join(dir, 'linkedin.svg');
    fs.writeFileSync(liSvgPath, createLinkedInSVG(banner));
    console.log(`  ✓ linkedin.svg`);
    await renderPNG(liSvgPath, path.join(dir, 'linkedin.png'), 1584, 396);
    await renderPNG(liSvgPath, path.join(dir, 'linkedin@2x.png'), 3168, 792);

    const xSvgPath = path.join(dir, 'x.svg');
    fs.writeFileSync(xSvgPath, createXSVG(banner));
    console.log(`  ✓ x.svg`);
    await renderPNG(xSvgPath, path.join(dir, 'x.png'), 1200, 675);
    await renderPNG(xSvgPath, path.join(dir, 'x@2x.png'), 2400, 1350);

    console.log();
  }

  console.log('Done! All banners generated.');
}

main().catch(err => { console.error(err); process.exit(1); });

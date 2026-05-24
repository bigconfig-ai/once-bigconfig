import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'banners', 'infographic');

// Brand colors
const BLUE = '#0652e9';
const CYAN = '#62e1e9';
const WHITE = '#ffffff';
const DARK = '#0b0e2a';
const CARD_BG = '#131743';
const CARD_BORDER = '#1e2360';

const W = 1200;
const H = 1600;

const CARDS = [
  {
    num: '01',
    icon: '🤖',
    title: 'Coding Agents Change the Game',
    desc: 'Supporting multiple languages is no longer a problem. Agents handle it seamlessly.',
  },
  {
    num: '02',
    icon: '🌐',
    title: 'Write in Your Language',
    desc: 'Author packages in Clojure, TypeScript, or Python. Your agent maintains every implementation.',
  },
  {
    num: '03',
    icon: '✅',
    title: 'Config Files Are the Test',
    desc: 'The rendered output verifies every implementation is correct — no surprises.',
  },
  {
    num: '04',
    icon: '🔗',
    title: 'Shared Configurations',
    desc: 'One configuration definition powers all language implementations simultaneously.',
  },
  {
    num: '05',
    icon: '⚡',
    title: 'Simpler Than CDK & Pulumi',
    desc: 'Define infrastructure packages in any language without the complexity.',
  },
];

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function svgTemplate() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${DARK}"/>
      <stop offset="50%" stop-color="#0d1235"/>
      <stop offset="100%" stop-color="${DARK}"/>
    </linearGradient>
    <radialGradient id="glowTop" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCyan" cx="80%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BLUE}"/>
      <stop offset="50%" stop-color="${CYAN}"/>
      <stop offset="100%" stop-color="${BLUE}"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${CARD_BG}"/>
      <stop offset="100%" stop-color="#0f1340"/>
    </linearGradient>
    <linearGradient id="langGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${CYAN}"/>
      <stop offset="50%" stop-color="${WHITE}"/>
      <stop offset="100%" stop-color="${CYAN}"/>
    </linearGradient>
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#glowTop)"/>
  <rect width="${W}" height="${H}" fill="url(#glowCyan)"/>

  <!-- Grid pattern -->
  <g opacity="0.03" stroke="${WHITE}" stroke-width="0.5">
    ${(() => {
      let lines = '';
      for (let x = 0; x < W; x += 60) {
        lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
      }
      for (let y = 0; y < H; y += 60) {
        lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
      }
      return lines;
    })()}
  </g>

  <!-- Large decorative circles -->
  <circle cx="1000" cy="300" r="350" fill="${BLUE}" opacity="0.04"/>
  <circle cx="200" cy="1200" r="280" fill="${CYAN}" opacity="0.03"/>
  <circle cx="600" cy="800" r="200" fill="${BLUE}" opacity="0.03"/>

  <!-- ===== HEADER ===== -->
  <!-- Logo -->
  <g transform="translate(60, 50) scale(0.5)">
    <g transform="matrix(2.6788,0,0,2.6788,-299.1,-331.55)">
      <g transform="translate(-5.8594,18.48)">
        <path fill="${BLUE}" d="m 165.23047,182.66406 v 8.30078 L 127.63672,173.5 v -6.73438 l 37.59375,-17.46875 v 8.30469 l -28.42969,12.45313 v 0.15625 z m 22.32812,-42.58984 H 124.6875 c -2.96875,0 -5.375,2.40625 -5.375,5.375 v 49.36719 c 0,2.96875 2.40625,5.375 5.375,5.375 h 45.41797 l 17.45312,-60.11719" fill-opacity="1" fill-rule="nonzero"/>
      </g>
      <g transform="translate(-5.8594,18.48)">
        <path fill="${CYAN}" d="m 247.37891,142.21094 -37.59375,17.23047 v -8.30469 l 29.05468,-12.45313 v -0.15625 l -29.05468,-12.45312 v -8.30078 l 37.59375,17.23047 z m -42.36719,-33.66406 -17.45313,60.11718 h 62.76953 c 2.96485,0 5.3711,-2.40625 5.3711,-5.375 v -49.36718 c 0,-2.96875 -2.40625,-5.375 -5.3711,-5.375 h -45.3164" fill-opacity="1" fill-rule="nonzero"/>
      </g>
    </g>
    <text x="195" y="90" font-family="Now" font-weight="bold" font-size="72px" fill="${WHITE}" letter-spacing="2">BIGCONFIG</text>
  </g>

  <!-- Now supporting -->
  <text font-family="Now" font-weight="600" font-size="22" fill="${CYAN}" opacity="0.8" letter-spacing="4">
    <tspan x="60" y="190">THE FIRST AGENTIC PACKAGE MANAGER</tspan>
  </text>

  <!-- Language headline -->
  <text font-family="Now" font-weight="bold" font-size="56" fill="${WHITE}" letter-spacing="1">
    <tspan x="60" y="270">Now Supporting</tspan>
  </text>

  <!-- Language badges -->
  <g transform="translate(60, 320)">
    <!-- Clojure badge -->
    <rect x="0" y="0" width="220" height="50" rx="25" ry="25" fill="${BLUE}" opacity="0.2"/>
    <text x="110" y="32" font-family="Now" font-weight="bold" font-size="22" fill="${CYAN}" text-anchor="middle">Clojure</text>

    <!-- TypeScript badge -->
    <rect x="240" y="0" width="240" height="50" rx="25" ry="25" fill="${BLUE}" opacity="0.2"/>
    <text x="360" y="32" font-family="Now" font-weight="bold" font-size="22" fill="${CYAN}" text-anchor="middle">TypeScript</text>

    <!-- Python badge -->
    <rect x="500" y="0" width="220" height="50" rx="25" ry="25" fill="${BLUE}" opacity="0.2"/>
    <text x="610" y="32" font-family="Now" font-weight="bold" font-size="22" fill="${CYAN}" text-anchor="middle">Python</text>
  </g>

  <!-- Accent divider -->
  <rect x="60" y="420" width="200" height="3" rx="1.5" fill="url(#accentBar)"/>

  <!-- ===== CARDS ===== -->
  <!-- Row 1: cards 1, 2, 3 -->
  ${[0, 1, 2].map(i => renderCard(i, 0)).join('')}
  <!-- Row 2: cards 4, 5 (centered) -->
  ${[3, 4].map(i => renderCard(i, 1)).join('')}

  <!-- ===== FOOTER ===== -->
  <rect x="0" y="${H - 100}" width="${W}" height="100" fill="${DARK}" opacity="0.8"/>
  <line x1="0" y1="${H - 100}" x2="${W}" y2="${H - 100}" stroke="${BLUE}" stroke-width="1" opacity="0.3"/>

  <text font-family="Now" font-weight="600" font-size="18" fill="${WHITE}" opacity="0.4" text-anchor="middle">
    <tspan x="600" y="${H - 55}">bigconfig.ai</tspan>
  </text>
  <text font-family="Now" font-weight="500" font-size="14" fill="${WHITE}" opacity="0.25" text-anchor="middle">
    <tspan x="600" y="${H - 30}">Define once. Run everywhere.</tspan>
  </text>

</svg>`;
}

function renderCard(index, row) {
  const card = CARDS[index];
  const cardW = 340;
  const cardH = 200;
  const gap = 30;

  let cx;
  if (row === 0) {
    // 3 cards centered
    const totalW = 3 * cardW + 2 * gap;
    const startX = (W - totalW) / 2;
    cx = startX + index * (cardW + gap);
  } else {
    // 2 cards centered
    const subIndex = index - 3;
    const totalW = 2 * cardW + gap;
    const startX = (W - totalW) / 2;
    cx = startX + subIndex * (cardW + gap);
  }

  const cy = row === 0 ? 500 : 760;
  const numSize = 48;

  return `
  <!-- Card ${card.num} -->
  <g transform="translate(${cx}, ${cy})">
    <!-- Card background -->
    <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="16" ry="16" fill="url(#cardGrad)" stroke="${CARD_BORDER}" stroke-width="1" opacity="0.95"/>

    <!-- Top accent line -->
    <rect x="0" y="0" width="${cardW}" height="3" rx="1.5" fill="url(#accentBar)"/>

    <!-- Number -->
    <text x="20" y="45" font-family="Now" font-weight="bold" font-size="${numSize}" fill="${BLUE}" opacity="0.15">${card.num}</text>

    <!-- Icon circle -->
    <circle cx="45" cy="80" r="24" fill="${BLUE}" opacity="0.15"/>
    <text x="45" y="90" font-family="Arial" font-size="22" text-anchor="middle">${card.icon}</text>

    <!-- Title -->
    <text x="85" y="75" font-family="Now" font-weight="bold" font-size="17" fill="${WHITE}">${esc(card.title)}</text>

    <!-- Description -->
    <text x="85" y="105" font-family="Now" font-weight="400" font-size="14" fill="${WHITE}" opacity="0.6">
      <tspan x="85" dy="0">${esc(wrapText(card.desc, 32, 0))}</tspan>
      <tspan x="85" dy="20">${esc(wrapText(card.desc, 32, 1))}</tspan>
    </text>

    <!-- Bottom-right decorative dot -->
    <circle cx="${cardW - 20}" cy="${cardH - 20}" r="4" fill="${CYAN}" opacity="0.15"/>
    <circle cx="${cardW - 30}" cy="${cardH - 15}" r="2" fill="${BLUE}" opacity="0.1"/>
  </g>`;
}

function wrapText(text, maxChars, line) {
  // Simple word wrap
  const words = text.split(' ');
  let lines = [''];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if ((last + ' ' + word).trim().length <= maxChars) {
      lines[lines.length - 1] = (last + ' ' + word).trim();
    } else {
      lines.push(word);
    }
  }
  return lines[line] || '';
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('Generating infographic...\n');

  const svgContent = svgTemplate();
  const svgPath = path.join(OUT, 'infographic.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log(`  ✓ infographic.svg`);

  // Render PNGs
  const pngPath = path.join(OUT, 'infographic.png');
  await sharp(Buffer.from(svgContent))
    .resize(W, H)
    .png()
    .toFile(pngPath);
  console.log(`  ✓ infographic.png (${W}×${H})`);

  const png2xPath = path.join(OUT, 'infographic@2x.png');
  await sharp(Buffer.from(svgContent))
    .resize(W * 2, H * 2)
    .png()
    .toFile(png2xPath);
  console.log(`  ✓ infographic@2x.png (${W * 2}×${H * 2})`);

  console.log('\nDone!');
}

main().catch(err => { console.error(err); process.exit(1); });

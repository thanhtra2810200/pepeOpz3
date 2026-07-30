// ─── Image assets ────────────────────────────────────────────────────────────
export const CARD_IMAGES = [
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_41_32%20PM.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_39_25%20PM.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/ChatGPT%20Image%2015_16_27%2030%20thg%207,%202026.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_50_47%20PM.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2003_02_50%20PM%20(2).webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2003_01_42%20PM.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%2015_02_28%2030%20thg%207,%202026.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%2015_08_19%2030%20thg%207,%202026.webp',
  'https://ik.imagekit.io/zznoau6lx/tr:w-800,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_55_20%20PM.webp',
];

// Fallback for broken images — Pepe-green gradient square
export const FALLBACK_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#22c55e"/>' +
    '<stop offset="1" stop-color="#14532d"/>' +
    '</linearGradient></defs>' +
    '<rect width="90" height="90" rx="14" fill="#166534"/>' +
    '<rect width="90" height="90" rx="14" fill="url(#g)" opacity="0.6"/>' +
    '</svg>'
  );

// ─── Constants ───────────────────────────────────────────────────────────────
export const START_COUNT = 779_711_289;

export const Z_FAR = 0.1;
export const Z_NEAR = 0.6;

export const VZ_MIN = 0.00130;
export const VZ_MAX = 0.00190;

export const BASE_CARD_PX = 180;

// 7 active compass directions — center-bottom (S) removed
// (screen coords: +x right, +y down)
export const COMPASS_ANGLES = [
  -Math.PI / 2,        // N
  -Math.PI / 4,        // NE
  0,                   // E
  Math.PI / 4,         // SE
  (3 * Math.PI) / 4,   // SW
  Math.PI,             // W
  -(3 * Math.PI) / 4,  // NW
];

// One card per lane on every device — pool size equals lane count
export const POOL_SIZE = COMPASS_ANGLES.length;

export const INCREMENT_TABLE = [
  { value: 15,     weight: 38 },
  { value: 80,     weight: 26 },
  { value: 350,    weight: 18 },
  { value: 2500,   weight: 12 },
  { value: 12000,  weight: 6 },
];
export const INCREMENT_INTERVAL_MS = 1400;

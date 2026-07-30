export interface Segment {
  label: string;
  value: number;
  color: string;
}

export const SEGMENTS: Segment[] = [
  { label: 'Liquidity Pool',     value: 63.1, color: '#4ade80' },
  { label: 'Burned',             value: 20.0, color: '#16a34a' },
  { label: 'CEX Reserves',       value: 10.0, color: '#22c55e' },
  { label: 'Community Rewards',  value: 5.0,  color: '#86efac' },
  { label: 'Team (locked 2y)',   value: 1.9,  color: '#15803d' },
];

export interface TokenStat {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
}

export const STATS: TokenStat[] = [
  { label: 'Total Supply',  value: 420.69, suffix: 'T', prefix: '' },
  { label: 'Holders',       value: 300,    suffix: 'K+', prefix: '' },
  { label: 'Market Cap',    value: 1.2,    suffix: 'B',  prefix: '$' },
  { label: 'Liquidity',     value: 8.4,    suffix: 'M',  prefix: '$' },
];

export const ROTATING_WORDS = ['MATTER', 'WINS', 'PUMPS', 'MOONS', 'PRINTS'];

export const BG_IMAGE_DESKTOP =
  'https://ik.imagekit.io/zznoau6lx/tr:w-1600,q-75,f-webp/PEPE/ChatGPT%20Image%2016_07_18%2030%20thg%207,%202026.webp';
export const BG_IMAGE_MOBILE =
  'https://ik.imagekit.io/zznoau6lx/tr:w-768,q-75,f-webp/PEPE/ChatGPT%20Image%2016_07_18%2030%20thg%207,%202026.webp';

export const DONUT_RADIUS = 90;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

import {
  CARD_IMAGES,
  FALLBACK_IMG,
  COMPASS_ANGLES,
  VZ_MIN,
  VZ_MAX,
  Z_FAR,
} from './constants';
import type { Card } from './types';

/**
 * Spawn (or respawn) a card into its permanent lane.
 *
 * Direction is NEVER chosen here — it is fixed by card.laneIndex.
 * Only radius, z, speed, tilt, drift, and image are regenerated on respawn.
 */
export function spawnCard(
  card: Card,
  fieldW: number,
  fieldH: number,
  spreadZ = false,
): void {
  const minR = Math.min(fieldW, fieldH) * 0.26;
  const maxR = Math.min(fieldW, fieldH) * 0.45;

  // Fixed lane angle with very small jitter (±7°) — never enough to cross lanes
  const baseAngle = COMPASS_ANGLES[card.laneIndex];
  const jitter = (Math.random() - 0.5) * (7 * Math.PI / 180);
  const angle = baseAngle + jitter;

  const t = 0.45 + Math.random() * 0.55;
  const radius = minR + (maxR - minR) * t;

  card.x0 = Math.cos(angle) * radius;
  card.y0 = Math.sin(angle) * radius;
  card.x = card.x0;
  card.y = card.y0;

  if (!spreadZ) {
    card.z = Z_FAR + Math.random() * 0.04;
  }
  card.vz = VZ_MIN + Math.random() * (VZ_MAX - VZ_MIN);

  card.driftAmp = Math.random() * 10;
  card.driftPhase = Math.random() * Math.PI * 2;
  card.tilt = (Math.random() - 0.5) * 16;

  // Avoid same image twice consecutively in this lane
  let imgIdx: number;
  do {
    imgIdx = Math.floor(Math.random() * CARD_IMAGES.length);
  } while (imgIdx === card.lastImgIdx && CARD_IMAGES.length > 1);
  card.lastImgIdx = imgIdx;

  // One-shot error fallback — replaced on every src assignment
  card.img.onerror = () => {
    card.img.onerror = null;
    card.img.src = FALLBACK_IMG;
  };
  if (card.img.src !== CARD_IMAGES[imgIdx]) card.img.src = CARD_IMAGES[imgIdx];

  card.active = true;
  card.el.style.opacity = '0';
}

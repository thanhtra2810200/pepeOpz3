import { Z_NEAR, INCREMENT_TABLE } from './constants';

// ─── Depth curves ─────────────────────────────────────────────────────────────
export function depthOpacity(z: number): number {
  const fadeStart = Z_NEAR * 0.65;

  if (z < 0.15) return z / 0.22;

  if (z < fadeStart) return 1;

  return Math.max(0, (Z_NEAR - z) / (Z_NEAR - fadeStart));
}

export function depthBlur(z: number): number {
  if (z < 0.30)
    return (1 - z / 0.30) * 3;

  const blurStart = Z_NEAR * 0.75;

  if (z > blurStart)
    return ((z - blurStart) / (Z_NEAR - blurStart)) * 2;

  return 0;
}

export function depthScale(z: number): number {
  const nz = z / Z_NEAR;
  return 0.28 + Math.pow(nz, 1.55) * 1.18;
}

export function depthBrightness(z: number): number {
  const brightStart = Z_NEAR * 0.75;

  if (z < brightStart) return 1;

  return (
    1 +
    Math.min(
      1,
      (z - brightStart) / (Z_NEAR - brightStart)
    ) * 0.08
  );
}

// ─── Increment picker ──────────────────────────────────────────────────────────
export function pickIncrement(): number {
  const total = INCREMENT_TABLE.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of INCREMENT_TABLE) {
    r -= e.weight;
    if (r <= 0) return e.value;
  }
  return INCREMENT_TABLE[0].value;
}

// ─── Lane helpers ─────────────────────────────────────────────────────────────
// Bottom lanes (SE, SW) travel less and fade earlier at the bottom edge.
export function isBottomLane(laneAngle: number): boolean {
  return Math.sin(laneAngle) > 0.5;
}

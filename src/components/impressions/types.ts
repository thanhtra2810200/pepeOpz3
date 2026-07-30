import type { COMPASS_ANGLES } from './constants';

export type Card = {
  el: HTMLDivElement;
  img: HTMLImageElement;
  laneIndex: number; // permanent lane assignment — never changes
  x0: number;
  y0: number;
  x: number;
  y: number;
  z: number;
  vz: number;
  driftAmp: number;
  driftPhase: number;
  tilt: number;
  active: boolean;
  lastImgIdx: number;
};

export type FieldSize = { w: number; h: number };

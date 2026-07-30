import type { Renderer, Transform } from 'ogl';

export type GL = Renderer['gl'];

export interface ScreenSize {
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

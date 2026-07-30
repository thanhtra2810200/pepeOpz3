import { Texture } from 'ogl';
import type { GL } from './types';

interface CachedTexture {
  texture: Texture;
  width: number;
  height: number;
  refCount: number;
}

const textureCache = new Map<string, CachedTexture>();

export function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

export function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px monospace',
  color: string = 'black'
): { texture: Texture; width: number; height: number } {
  const cacheKey = `${text}||${font}||${color}`;

  const cached = textureCache.get(cacheKey);
  if (cached) {
    cached.refCount++;
    return { texture: cached.texture, width: cached.width, height: cached.height };
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;

  textureCache.set(cacheKey, { texture, width: canvas.width, height: canvas.height, refCount: 1 });
  return { texture, width: canvas.width, height: canvas.height };
}

export function releaseTextTexture(text: string, font: string, color: string): void {
  const cacheKey = `${text}||${font}||${color}`;
  const cached = textureCache.get(cacheKey);
  if (!cached) return;
  cached.refCount--;
  if (cached.refCount <= 0) {
    textureCache.delete(cacheKey);
  }
}

export function clearTextureCache(): void {
  textureCache.clear();
}

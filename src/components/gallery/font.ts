export const DEFAULT_FONT = 'bold 30px Figtree';
export const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap';

const fontCache = new Map<string, Promise<string>>();

export function deriveFontFamilyFromUrl(url: string): string {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

export async function loadFontFromStylesheet(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family: string | null = null;
  const fontFaces: FontFace[] = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors: FontFaceDescriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      document.fonts.add(face);
    })
  );
  return family;
}

export async function loadFontFromFile(url: string): Promise<string> {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

export async function loadCustomFont(fontUrl: string): Promise<string> {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

export async function resolveFont(font: string, fontUrl?: string): Promise<string> {
  const cacheKey = `${font}||${fontUrl || ''}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);
    if (!effectiveUrl) {
      if (document.fonts && document.fonts.load) {
        try {
          await document.fonts.load(font);
          await document.fonts.ready;
        } catch {
          // Ignore
        }
      }
      return font;
    }
    try {
      const family = await loadCustomFont(effectiveUrl);
      const sizeMatch = font.match(/^\s*(.*?\d+px)/);
      const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px';
      const resolved = `${prefix} "${family}"`;
      if (document.fonts && document.fonts.load) {
        try {
          await document.fonts.load(resolved);
        } catch {
          // Ignore
        }
      }
      return resolved;
    } catch (error) {
      console.error('CircularGallery: unable to load font from', fontUrl, error);
      return font;
    }
  })();

  fontCache.set(cacheKey, promise);
  return promise;
}

export function clearFontCache(): void {
  fontCache.clear();
}

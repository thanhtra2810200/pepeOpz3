import { useEffect, useRef } from 'react';
import { resolveFont } from './gallery/font';
import { GalleryApp } from './gallery/GalleryApp';

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

export default function CircularGallery({
  items,
  bend = 0.8,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    let app: GalleryApp | undefined;
    let isMounted = true;
    resolveFont(font, fontUrl).then(resolvedFont => {
      if (!isMounted || !containerRef.current) return;
      app = new GalleryApp(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        scrollSpeed,
        scrollEase
      });
    });
    return () => {
      isMounted = false;
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase]);
  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Use Left and Right Arrow keys to navigate."
    />
  );
}

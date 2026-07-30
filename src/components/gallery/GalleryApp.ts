import { Camera, Plane, Renderer, Transform } from 'ogl';
import type { GL, ScreenSize, Viewport } from './types';
import { debounce, lerp } from './utils';
import { GalleryMedia } from './GalleryMedia';

export interface GalleryAppConfig {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

const DEFAULT_ITEMS: { image: string; text: string }[] = [
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%2015_23_48%2030%20thg%207,%202026.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_49_48%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_51_37%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_52_12%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_46_19%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_53_16%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%2015_22_19%2030%20thg%207,%202026.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_53_48%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_54_55%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_56_14%20PM.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%2015_00_25%2030%20thg%207,%202026.webp',
    text: 'PEPE'
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_57_09%20PM.webp',
    text: 'PEPE'
  }
];

export class GalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: GalleryMedia[] = [];
  mediasImages: { image: string; text: string }[] = [];
  screen!: ScreenSize;
  viewport!: Viewport;
  raf: number = 0;
  isVisible: boolean = true;

  private resizeObserver!: ResizeObserver;
  private intersectionObserver!: IntersectionObserver;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnPointerDown!: (e: PointerEvent) => void;
  boundOnPointerMove!: (e: PointerEvent) => void;
  boundOnPointerUp!: (e: PointerEvent) => void;
  boundOnKeyDown!: (e: KeyboardEvent) => void;

  isDown: boolean = false;
  start: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05
    }: GalleryAppConfig
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    if (!this.gl) return;
    this.createCamera();
    this.createScene();
    this.createGeometry();
    this.onResize();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    if (!this.gl) {
      this.container.classList.add('no-webgl');
      return;
    }
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    if (!this.gl) return;
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(
    items: { image: string; text: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const galleryItems = items && items.length ? items : DEFAULT_ITEMS;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new GalleryMedia({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }

  onPointerDown(e: PointerEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.clientX;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDown) return;
    const distance = (this.start - e.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onPointerUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    if (!this.gl || !this.renderer) return;
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update = () => {
    if (!this.isVisible || !this.gl) {
      this.raf = 0;
      return;
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    // ResizeObserver — observes the container directly, no global window listener.
    this.resizeObserver = new ResizeObserver(debounce(this.boundOnResize, 100));
    this.resizeObserver.observe(this.container);

    // IntersectionObserver — pauses rendering when the gallery is off-screen.
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && this.raf === 0) {
          this.raf = window.requestAnimationFrame(this.update);
        }
      },
      { threshold: 0 }
    );
    this.intersectionObserver.observe(this.container);

    // Pointer Events on the container — replaces global mouse + touch listeners.
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('pointerdown', this.boundOnPointerDown);
    window.addEventListener('pointermove', this.boundOnPointerMove);
    window.addEventListener('pointerup', this.boundOnPointerUp);
    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);

    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();

    this.container.removeEventListener('wheel', this.boundOnWheel);
    this.container.removeEventListener('pointerdown', this.boundOnPointerDown);
    window.removeEventListener('pointermove', this.boundOnPointerMove);
    window.removeEventListener('pointerup', this.boundOnPointerUp);
    this.container.removeEventListener('keydown', this.boundOnKeyDown);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

import type { ComponentType } from 'react';
import { SocialIcon } from './SocialIcon';

export interface GalleryItem {
  image: string;
  text: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%2015_23_48%2030%20thg%207,%202026.webp',
    text: 'Instagram @pepe.official 2.1M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_49_48%20PM.webp',
    text: 'TikTok @pepe.dance 1.8M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_51_37%20PM.webp',
    text: 'YouTube Pepe Channel 940K',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_52_12%20PM.webp',
    text: 'X @pepe 1.2M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_46_19%20PM.webp',
    text: 'Telegram Pepe Army 560K',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_53_16%20PM.webp',
    text: 'Discord Pepe Lounge 780K',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%2015_22_19%2030%20thg%207,%202026.webp',
    text: 'Instagram Reels 1.3M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_53_48%20PM.webp',
    text: 'TikTok Viral 2.7M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_54_55%20PM.webp',
    text: 'Meme Drops 4.1M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_56_14%20PM.webp',
    text: 'Trending Now 1.9M',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%2015_00_25%2030%20thg%207,%202026.webp',
    text: 'Community Event',
  },
  {
    image: 'https://ik.imagekit.io/zznoau6lx/tr:w-700,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%20Jul%2030,%202026,%2002_57_09%20PM.webp',
    text: 'Pepe Forever',
  },
];

export interface SocialPlatform {
  icon: ComponentType<{ src: string; size: number }>;
  iconSrc: string;
  iconSize: number;
  name: string;
  font: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    icon: SocialIcon,
    iconSrc: 'https://ik.imagekit.io/zznoau6lx/tr:w-64,q-90,f-webp/PEPE/bieu-tuong-instagram-logo-huy-hieu-hien-dai_578229-124%20(1).webp',
    iconSize: 26,
    name: 'Instagram',
    font: '"Billabong", "Segoe Script", "Comic Sans MS", cursive',
  },
  {
    icon: SocialIcon,
    iconSrc: 'https://ik.imagekit.io/zznoau6lx/tr:w-64,q-90,f-webp/PEPE/tiktok-logo.webp',
    iconSize: 24,
    name: 'TikTok',
    font: '"TikTok Display", "Montserrat", "Arial Black", sans-serif',
  },
  {
    icon: SocialIcon,
    iconSrc: 'https://ik.imagekit.io/zznoau6lx/tr:w-64,q-90,f-webp/PEPE/youtube-logo-youtube-icon-transparent-free-png.webp',
    iconSize: 28,
    name: 'YouTube',
    font: '"Helvetica Neue", Arial, sans-serif',
  },
  {
    icon: SocialIcon,
    iconSrc: 'https://ik.imagekit.io/zznoau6lx/tr:w-64,q-90,f-webp/PEPE/x-logo-minimalist-monochrome-x-logo-2PEkUhZB-Photoroom.webp',
    iconSize: 22,
    name: 'Twitter',
    font: '"Chirp", "Helvetica Neue", Arial, sans-serif',
  },
];

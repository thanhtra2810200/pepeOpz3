import { Wallet, Coins, ArrowLeftRight, PartyPopper, type LucideIcon } from 'lucide-react';

const STEP_IMAGES = [
  'https://ik.imagekit.io/zznoau6lx/tr:w-600,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_51_37%20PM.webp?updatedAt=1785401156748',
  'https://ik.imagekit.io/zznoau6lx/tr:w-600,q-80,f-webp/PEPE/ChatGPT%20Image%20Jul%2030,%202026,%2002_50_47%20PM.webp?updatedAt=1785401156704',
  'https://ik.imagekit.io/zznoau6lx/tr:w-600,q-80,f-webp/PEPE/ChatGPT%20Image%2015_23_48%2030%20thg%207,%202026.webp?updatedAt=1785401156752',
  'https://ik.imagekit.io/zznoau6lx/tr:w-600,q-80,f-webp/PEPE/webp%201/ChatGPT%20Image%2015_00_25%2030%20thg%207,%202026.webp?updatedAt=1785400148395',
];

export interface BuyStep {
  icon: LucideIcon;
  title: string;
  body: string;
  background: string;
}

export const STEPS: BuyStep[] = [
  {
    icon: Wallet,
    title: 'Get a Wallet',
    body: 'Download MetaMask or your favorite self-custody wallet. Fund it with ETH on the Ethereum network.',
    background: STEP_IMAGES[0],
  },
  {
    icon: Coins,
    title: 'Get Some ETH',
    body: "Buy ETH on any exchange and transfer it to your wallet. You'll need it to swap for $PEPE and pay gas.",
    background: STEP_IMAGES[1],
  },
  {
    icon: ArrowLeftRight,
    title: 'Swap on Uniswap',
    body: 'Head to Uniswap, paste the $PEPE contract address, and swap your ETH for PEPE. Confirm and done.',
    background: STEP_IMAGES[2],
  },
  {
    icon: PartyPopper,
    title: 'Welcome Home',
    body: "You're now a Pepe holder. Join the community, share your memes, and watch the green candles.",
    background: STEP_IMAGES[3],
  },
];

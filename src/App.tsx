import { lazy, Suspense } from 'react';
import { CursorGlow } from '@/components/CursorGlow';
import { Navbar } from '@/components/Navbar';
import { HeroRevealTransition } from '@/components/HeroRevealTransition';
import { useLenis } from '@/hooks/useLenis';

const GlobalFollowers = lazy(() =>
  import('@/components/GlobalFollowers').then(m => ({ default: m.GlobalFollowers })),
);
const Tokenomics = lazy(() =>
  import('@/components/Tokenomics').then(m => ({ default: m.Tokenomics })),
);
const HowToBuyCommunityTransition = lazy(() =>
  import('@/components/HowToBuyCommunityTransition').then(m => ({ default: m.HowToBuyCommunityTransition })),
);
const FAQ = lazy(() =>
  import('@/components/FAQ').then(m => ({ default: m.FAQ })),
);
const Footer = lazy(() =>
  import('@/components/Community').then(m => ({ default: m.Footer })),
);

function App() {
  useLenis();

  return (
    <main className="bg-black min-h-screen">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-green-400 focus:text-black focus:font-bold"
      >
        Skip to content
      </a>
      <CursorGlow />
      <Navbar />
      <HeroRevealTransition />
      <Suspense fallback={null}>
        <GlobalFollowers />
        <Tokenomics />
        <HowToBuyCommunityTransition />
        <FAQ />
        <Footer />
      </Suspense>
    </main>
  );
}

export default App;

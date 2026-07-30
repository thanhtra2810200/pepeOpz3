import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { scrollToId } from '@/hooks/useScrollTo';
import { useScrollHide } from '@/hooks/useScrollHide';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useNavPill } from '@/hooks/useNavPill';
import { NAV_ITEMS, SECTION_IDS } from '@/components/navbar/constants';

export function Navbar() {
  const visible = useScrollHide();
  const activeIndex = useActiveSection(SECTION_IDS);

  const [menuOpen, setMenuOpen] = useState(false);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const pillStyle = useNavPill(activeIndex, navRef, itemRefs);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(href.slice(1));
  }, []);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLAnchorElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  return (
    <AnimatePresence initial={false}>
      {visible && (
      <motion.div
  key="navbar"
  className="fixed top-6 left-0 right-0 z-[100] pointer-events-none px-4 sm:px-6"
  initial={{ opacity: 0, y: -24 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -24 }}
  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
>

  {/* LEFT LOGO — desktop: absolute left-24, mobile: in-flow left edge */}
  <button
    onClick={() => { setMenuOpen(false); scrollToId('hero'); }}
    aria-label="$PEPE home"
    className="pointer-events-auto absolute left-6 sm:left-24 top-1 text-2xl sm:text-3xl font-black text-green-400 pepe-logo-glow"
    style={{
      fontFamily: '"Luckiest Guy", cursive',
      letterSpacing: '0.01em',
      textShadow: '0 0 16px rgba(74,222,128,0.45), 0 0 32px rgba(74,222,128,0.2)',
    }}
  >
    $PEPE
  </button>

  {/* CENTER NAV — desktop only */}
  <div className="hidden md:flex justify-center">

    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="pointer-events-auto relative flex items-center gap-2 px-4 py-2.5 rounded-full"
      style={{
        background: 'rgba(4,12,6,0.75)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(74,222,128,0.22)',
        boxShadow:
          '0 0 0 1px rgba(74,222,128,0.06), 0 8px 32px rgba(0,0,0,0.45), 0 0 40px rgba(74,222,128,0.07)',
      }}
    >

      {pillStyle && (
        <motion.span
          className="absolute top-[6px] bottom-[6px] rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(74,222,128,0.22), rgba(22,163,74,0.18))',
            border: '1px solid rgba(74,222,128,0.35)',
            boxShadow: '0 0 12px rgba(74,222,128,0.18)',
          }}
          animate={{
            left: pillStyle.left,
            width: pillStyle.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 36,
            mass: 0.8,
          }}
        />
      )}

      {NAV_ITEMS.map((item, i) => (
        <a
          key={item.label}
          ref={setItemRef(i)}
          href={item.href}
          onClick={(e) => handleNavClick(e, item.href)}
          className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            color:
              i === activeIndex
                ? '#4ade80'
                : 'rgba(156,163,175,0.9)',
          }}
        >
          {item.label}
        </a>
      ))}

    </nav>

  </div>

  {/* RIGHT BUY BUTTON — desktop only (md+). On mobile, the hamburger menu
      contains a Buy $PEPE button instead. */}
  <button
    onClick={() => scrollToId('how-to-buy')}
    aria-label="Buy $PEPE"
    className="pointer-events-auto hidden md:flex absolute right-24 top-0 px-6 py-3 rounded-full bg-green-400 text-black hover:scale-105 transition text-base items-center"
    style={{
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 800,
      boxShadow: '0 0 20px rgba(74,222,128,0.4), 0 0 40px rgba(74,222,128,0.15)',
    }}
  >
    Buy $PEPE
  </button>

  {/* MOBILE HAMBURGER — visible only below md */}
  <button
    onClick={() => setMenuOpen(o => !o)}
    className="pointer-events-auto md:hidden absolute right-6 top-0 w-10 h-10 flex items-center justify-center rounded-full"
    style={{
      background: 'rgba(4,12,6,0.75)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(74,222,128,0.22)',
    }}
    aria-label="Toggle menu"
    aria-expanded={menuOpen}
    aria-controls="mobile-nav"
  >
    {menuOpen ? <X className="w-5 h-5 text-green-400" /> : <Menu className="w-5 h-5 text-green-400" />}
  </button>

  {/* MOBILE DROPDOWN MENU */}
  <AnimatePresence>
    {menuOpen && (
      <motion.nav
        id="mobile-nav"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden pointer-events-auto absolute top-16 left-4 right-4 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(4,12,6,0.92)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(74,222,128,0.22)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(74,222,128,0.07)',
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="block px-6 py-3.5 text-sm font-semibold border-b border-white/5 last:border-0 transition-colors hover:bg-green-500/10"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: i === activeIndex ? '#4ade80' : 'rgba(156,163,175,0.9)',
            }}
          >
            {item.label}
          </a>
        ))}
        <button
          onClick={() => { setMenuOpen(false); scrollToId('how-to-buy'); }}
          aria-label="Buy $PEPE"
          className="w-full px-6 py-3.5 text-sm font-bold text-black bg-green-400 transition-colors hover:bg-green-300"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          Buy $PEPE
        </button>
      </motion.nav>
    )}
  </AnimatePresence>

</motion.div>
      )}
    </AnimatePresence>
  );
}

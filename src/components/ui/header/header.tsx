'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

interface HeaderProps {
  alwaysGlassy?: boolean;
  isDark?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  alwaysGlassy = false,
  isDark = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (alwaysGlassy) return;
    const shouldBeScrolled = latest > 80;
    if (shouldBeScrolled !== scrolled) {
      setScrolled(shouldBeScrolled);
    }
  });

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/About', label: 'About' },
    { href: '/Offerings', label: 'Offerings' },
    { href: '/Approach', label: 'Approach' },
    { href: '/Impact', label: 'Impact' },
    { href: '/News', label: 'News' },
  ];

  const showGlassy = alwaysGlassy || scrolled;
  const showWordmark = showGlassy || menuOpen;

  return (
    <header className="fixed top-0 z-40 w-full">
      <div className="max-w-[107rem] mx-auto mt-3 px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between h-13 rounded-2xl px-4 transition-colors duration-500
            ${showGlassy ? 'backdrop-blur-md' : 'bg-transparent'}
            ${
              isDark
                ? 'bg-white/10 text-[#FDFDFB]'
                : 'bg-black/10 text-[#2A2727]'
            }`}
        >
          {/* Left: Menu Toggle */}
          <div
            className="rounded-md p-1 hover:bg-gray-500/20 transition-all duration-300 ease-in-out items-center flex justify-center cursor-pointer text-center"
            onClick={() => setMenuOpen((prev: boolean) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setMenuOpen((prev) => !prev);
              }
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="space-y-1">
              {menuOpen ? (
                <div className="text-xl">✕</div>
              ) : (
                <>
                  <div className="w-4 h-0.25 bg-current" />
                  <div className="w-4 h-0.25 bg-current" />
                </>
              )}
            </div>
            <span className="ml-2 tracking-tight hidden md:block">
              {menuOpen ? 'Close' : 'Menu'}
            </span>
          </div>

          {/* Center: Wordmark or Menu */}
          <AnimatePresence mode="wait">
            {!menuOpen ? (
              showWordmark && (
                <motion.div
                  key="wordmark"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Link
                    href="/"
                    className="wordmark uppercase text-4xl sm:text-5xl leading-none"
                  >
                    TODD
                  </Link>
                </motion.div>
              )
            ) : (
              <motion.div
                key="navlinks"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 'auto' }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center gap-8 font-medium items-center text-center"
              >
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={`nav-${item.label}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: -0.5,
                        transition: { delay: index * 0.15 },
                      }}
                      exit={{ opacity: 0, x: -5 }}
                      className="flex items-center gap-1"
                    >
                      {isActive && (
                        <div className="w-2 h-2 bg-current rounded-full mt-1" />
                      )}
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md p-1 hover:bg-gray-500/20 transition-all duration-300 ease-in-out items-center"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Future auth links placeholder */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="tracking-tight rounded-md p-1 hover:bg-gray-500/20 transition-all duration-300 ease-in-out items-center hidden md:block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

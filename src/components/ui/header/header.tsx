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
import { Menu, X } from 'lucide-react';

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

  const showGlassy =
    alwaysGlassy ||
    scrolled ||
    (menuOpen && typeof window !== 'undefined' && window.innerWidth < 768);
  const showWordmark = showGlassy;

  return (
    <header className="fixed top-0 z-40 w-full">
      <div className="max-w-[107rem] mx-auto mt-3 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`relative flex flex-col rounded-2xl px-4 transition-colors duration-500 overflow-hidden
            ${showGlassy ? 'backdrop-blur-md' : 'bg-transparent'}
            ${
              isDark
                ? 'bg-white/10 text-[#FDFDFB]'
                : 'bg-black/10 text-[#2A2727]'
            }`}
          animate={{
            height:
              menuOpen &&
              typeof window !== 'undefined' &&
              window.innerWidth < 768
                ? 'auto'
                : '3.25rem', // h-13 = 3.25rem
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Header Top Section */}
          <div className="relative flex items-center justify-between h-13">
            {/* Left: Menu Toggle */}
            <div
              className="rounded-md p-1 footer-underline transition-all duration-300 ease-in-out flex items-center justify-start cursor-none nav-hover-cursor"
              onClick={() => setMenuOpen((prev: boolean) => !prev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setMenuOpen((prev) => !prev);
                }
              }}
              data-testid="menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="ml-2 tracking-tight hidden md:block leading-none pb-0.5">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </div>

            {/* Center: Mobile Wordmark (centered in header top section only) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
              <Link
                href="/"
                className="wordmark uppercase text-4xl leading-none"
                data-testid="mobile-wordmark-link"
              >
                TODD
              </Link>
            </div>

            {/* Right: Spacer for balance */}
            <div className="w-16 md:hidden"></div>

            {/* Desktop Navigation */}
            <AnimatePresence mode="wait">
              {!menuOpen ? (
                showWordmark && (
                  <motion.div
                    key="wordmark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                  >
                    <Link
                      href="/"
                      className="wordmark uppercase text-4xl sm:text-5xl leading-none"
                      data-testid="wordmark-link"
                    >
                      TODD
                    </Link>
                  </motion.div>
                )
              ) : (
                /* Desktop Navigation */
                <motion.div
                  key="navlinks"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 'auto' }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex justify-center gap-8 font-medium items-center text-center h-full"
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
                        className="flex items-center justify-center gap-1 h-full"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`rounded-md p-1 footer-underline transition-all duration-300 ease-in-out flex items-center justify-center cursor-none nav-hover-cursor ${
                            isActive ? 'footer-underline-active' : ''
                          }`}
                          data-testid={`nav-link-${item.label.toLowerCase()}`}
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
                className="tracking-tight rounded-md p-1 footer-underline transition-all duration-300 ease-in-out items-center hidden md:flex cursor-none nav-hover-cursor"
                data-testid="get-started-link"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Navigation - Inside the same island */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-6 border-t border-current/20">
                  <nav className="flex flex-col space-y-4">
                    {menuItems.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={`mobile-nav-${item.label}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: index * 0.1 },
                          }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex justify-center"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-xl font-medium footer-underline transition-all duration-300 ease-in-out cursor-none nav-hover-cursor ${
                              isActive ? 'footer-underline-active' : ''
                            }`}
                            data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}

                    {/* Mobile Get Started Button */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: menuItems.length * 0.1 },
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex justify-center pt-4 border-t border-current/20"
                    >
                      <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium footer-underline transition-all duration-300 ease-in-out cursor-none nav-hover-cursor"
                        data-testid="mobile-get-started-link"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;

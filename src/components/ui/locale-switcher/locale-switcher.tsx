'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  locales,
  localeNames,
  localeFlags,
  type Locale,
} from '@/lib/i18n/config';
import { themeUtils } from '@/lib/theme';

interface LocaleSwitcherProps {
  className?: string;
}

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    right?: number;
  }>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useLocale();
  const { isDark } = useTheme();
  const headerTheme = themeUtils.getComponentTheme('header', isDark);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Calculate optimal dropdown position to avoid going off-screen
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isMobile = windowWidth < 768;
      const dropdownWidth = isMobile ? Math.min(windowWidth - 32, 220) : 220;
      const dropdownHeight = locales.length * 60; // approximate height per item

      let top = rect.bottom + 8; // 8px below the button
      let left = rect.right - dropdownWidth; // Align to right edge

      // On mobile, adjust position if needed
      if (isMobile) {
        left = rect.left; // Align to left edge on mobile
      } else {
        // Desktop: Check if dropdown would go off-screen to the left
        if (left < 16) {
          left = rect.left; // Align to left edge of button
        }
      }

      // Check if dropdown would go off-screen below
      if (top + dropdownHeight > windowHeight - 16) {
        top = rect.top - dropdownHeight - 8; // Position above the button
      }

      // Ensure dropdown doesn't go off-screen to the right
      if (left + dropdownWidth > windowWidth - 16) {
        left = windowWidth - dropdownWidth - 16;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  // Render dropdown using portal to avoid header overflow issues
  const renderDropdown = () => {
    if (!mounted || !isOpen) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              ref={dropdownRef}
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed z-50 min-w-[180px] w-[220px] rounded-2xl overflow-hidden shadow-xl backdrop-blur-md"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                backgroundColor: headerTheme.background,
                borderColor: headerTheme.border,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
              }}
            >
              {locales.map((loc) => (
                <motion.button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out cursor-pointer"
                  style={{
                    color: headerTheme.text,
                    backgroundColor:
                      loc === locale ? headerTheme.hover : 'transparent',
                  }}
                  whileHover={{
                    backgroundColor: headerTheme.hover,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium uppercase tracking-wide opacity-60">
                      {loc}
                    </span>
                    <span className="text-sm font-medium">
                      {localeNames[loc]}
                    </span>
                  </div>
                  {loc === locale && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: headerTheme.text,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer hover:bg-opacity-80"
        style={{
          color: headerTheme.text,
        }}
        whileHover={{
          scale: 1.05,
          backgroundColor: headerTheme.hover,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="text-sm font-medium uppercase tracking-wide">
          {locale}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {renderDropdown()}
    </div>
  );
};

export default LocaleSwitcher;

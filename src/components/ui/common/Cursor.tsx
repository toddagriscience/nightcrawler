'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, animate } from 'framer-motion';

const Cursor = () => {
  const [isMobile, setIsMobile] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 }).current;
  const raf = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cursorColor, setCursorColor] = useState('#2A2727'); // Default to dark
  const [isVisible, setIsVisible] = useState(true);

  const move = useCallback(() => {
    if (!cursorRef.current) return;

    const cursorRect = cursorRef.current.getBoundingClientRect();
    const x = pointer.x - cursorRect.width / 1.5;
    const y = pointer.y - cursorRect.height / 1.5;

    animate(
      cursorRef.current,
      {
        x: x,
        y: y,
      },
      { duration: 0.09, ease: 'easeOut' }
    );

    raf.current = requestAnimationFrame(move);
  }, [pointer]);

  useEffect(() => {
    // Set mounted to true after first render to prevent hydration mismatch
    setMounted(true);

    const checkIsMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)
      );
    };

    checkIsMobile();

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const getElementColor = (el: Element | null): string => {
      try {
        if (!el) return '#2A2727';

        const style = getComputedStyle(el);
        const backgroundColor = style.backgroundColor;

        if (
          !backgroundColor ||
          backgroundColor === 'transparent' ||
          backgroundColor === 'rgba(0, 0, 0, 0)'
        ) {
          let parent = el.parentElement;
          while (parent) {
            const parentStyle = getComputedStyle(parent);
            const parentBackgroundColor = parentStyle.backgroundColor;
            if (
              parentBackgroundColor &&
              parentBackgroundColor !== 'transparent' &&
              parentBackgroundColor !== 'rgba(0, 0, 0, 0)'
            ) {
              return getLuminance(parentBackgroundColor) > 128
                ? '#2A2727'
                : '#F7F4EC';
            }
            parent = parent.parentElement;
          }
        } else {
          return getLuminance(backgroundColor) > 128 ? '#2A2727' : '#F7F4EC';
        }

        return '#2A2727';
      } catch (error) {
        console.error('Error getting element color:', error);
        return '#2A2727';
      }
    };

    const getLuminance = (color: string): number => {
      const colorParts = color.replace(/[^\d,]/g, '').split(',');
      if (colorParts.length === 3) {
        const r = parseInt(colorParts[0], 10);
        const g = parseInt(colorParts[1], 10);
        const b = parseInt(colorParts[2], 10);
        return 0.299 * r + 0.587 * g + 0.114 * b;
      }

      const hex = colorToHex(color);
      if (hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return 0.299 * r + 0.587 * g + 0.114 * b;
      }

      return 0;
    };

    const colorToHex = (color: string): string | null => {
      const namedColors: { [key: string]: string } = {
        black: '#000000',
        white: '#ffffff',
        red: '#ff0000',
        green: '#008000',
        blue: '#0000ff',
        yellow: '#ffff00',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        gray: '#808080',
        darkgray: '#a9a9a9',
        lightgray: '#d3d3d3',
        transparent: 'rgba(0,0,0,0)',
      };
      const lowerCaseColor = color.toLowerCase();
      if (namedColors[lowerCaseColor]) {
        return namedColors[lowerCaseColor];
      }
      //handles hex colors
      if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
        let hex = color.substring(1);
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        return '#' + hex;
      }
      return null;
    };

    const handleCursorStyle = () => {
      document.body.style.cursor = 'none';

      document.querySelectorAll('*').forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.cursor = 'none';
        }
      });
    };

    const updateCursorColor = (e: MouseEvent) => {
      try {
        const target = e.target as Element;
        const color = getElementColor(target);
        setCursorColor(color);
        setIsVisible(true);
      } catch (error) {
        console.error('Error updating cursor color:', error);
      }
    };

    if (!isMobile && mounted) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', updateCursorColor);
      raf.current = requestAnimationFrame(move);
      handleCursorStyle();
    }

    return () => {
      if (!isMobile && mounted) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', updateCursorColor);
        if (raf.current) {
          cancelAnimationFrame(raf.current);
        }

        document.body.style.cursor = '';
      }
    };
  }, [isMobile, mounted, move, pointer]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted || isMobile) {
    return null;
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none"
      style={{
        width: 8,
        height: 8,
        translateX: -4,
        translateY: -4,
        backgroundColor: cursorColor,
        opacity: !isVisible ? 0 : 0.8,
        display: 'block',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.9, scale: 1 }}
    />
  );
};

export default Cursor;

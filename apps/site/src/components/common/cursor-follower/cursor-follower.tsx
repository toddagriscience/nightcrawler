// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import useMediaQuery from '@/lib/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';
import { CURSOR_LABEL_ATTRIBUTE } from './constants';
import type { CursorFollowerProps } from './types/cursor-follower';

export type { CursorFollowerProps } from './types/cursor-follower';

/**
 * Devices whose PRIMARY input is a real mouse/trackpad; touch-only screens get
 * no follower at all. Hybrids (touchscreen laptops) do match, so the event
 * handlers additionally ignore non-mouse pointers.
 */
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** Parks the bubble off-screen until the first pointer event arrives. */
const OFFSCREEN = -100;

/** Trailing feel of the bubble; `skipInitialAnimation` stops the first update from tweening in from the park position. */
const FOLLOW_SPRING = {
  stiffness: 500,
  damping: 45,
  mass: 0.5,
  skipInitialAnimation: true,
};

/**
 * Opacity of the bubble at rest on a hovered target. Deliberately translucent
 * so the row's own text stays readable underneath it, and so the bubble reads
 * as an accent rather than as a replacement for the OS pointer (which stays
 * visible — see the note in `globals.css`).
 */
const ACTIVE_OPACITY = 0.4;

/** Scale/opacity pop when a labelled target is hovered. */
const POP_SPRING = { type: 'spring', stiffness: 320, damping: 26 } as const;

/**
 * Whether the event comes from a mouse-like pointer. Touch (and pen) input on
 * hybrid fine-pointer devices must not drive the follower — a tap would flash
 * the bubble at the last mouse position. An empty/undefined `pointerType`
 * (older engines, synthetic events in tests) is treated as a mouse.
 *
 * @param event - The pointer event to classify
 */
function isMousePointer(event: PointerEvent): boolean {
  return (
    event.pointerType === 'mouse' ||
    event.pointerType === '' ||
    event.pointerType === undefined
  );
}

/**
 * Custom cursor follower: a dark pill that trails the pointer and expands to
 * show a label and a trailing arrow while hovering any element tagged with
 * {@link CURSOR_LABEL_ATTRIBUTE} (e.g. a news row tagged `data-cursor-label="Read"`).
 *
 * Shape and sizing intentionally mirror the site's pill `Button` (see
 * `components/common/button/themes/button.tsx`): the same `rounded-full`
 * geometry, `gap-2` between label and arrow, and the same `HiArrowLongRight`
 * glyph, one step smaller so the cursor reads as a cursor rather than as a
 * control the user is meant to click.
 *
 * Renders nothing on the server and on touch devices; on a fine pointer it
 * listens for pointer events at the document level, so tagged targets can be
 * server-rendered anywhere on the page without wiring per-element handlers.
 * The `<html>` marker that hides the native cursor is only set once a real
 * pointer position is known, and whenever the bubble reappears from a hidden
 * state it jumps to the pointer instead of animating in from its old position.
 * Purely decorative: `aria-hidden`, never intercepts pointer events, and drops
 * the spring smoothing when the user prefers reduced motion.
 *
 * @param {CursorFollowerProps} props - Component props
 * @returns {JSX.Element | null} - The follower bubble, or `null` when not applicable
 */
export function CursorFollower({ className }: CursorFollowerProps) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduceMotion = useReducedMotion() ?? false;
  const [label, setLabel] = useState<string | null>(null);
  const labelRef = useRef<string | null>(null);
  const hasPositionRef = useRef(false);

  const pointerX = useMotionValue(OFFSCREEN);
  const pointerY = useMotionValue(OFFSCREEN);
  const springX = useSpring(pointerX, FOLLOW_SPRING);
  const springY = useSpring(pointerY, FOLLOW_SPRING);

  useEffect(() => {
    if (!hasFinePointer) return;

    // Track the first real pointer position so the bubble can jump to it
    // instead of tweening in from its off-screen park position.
    const markPositioned = (x: number, y: number) => {
      if (hasPositionRef.current) return;
      hasPositionRef.current = true;
      pointerX.jump(x);
      pointerY.jump(y);
      springX.jump(x);
      springY.jump(y);
    };

    const applyLabel = (next: string | null) => {
      labelRef.current = next;
      setLabel(next);
    };

    const handleMove = (event: PointerEvent) => {
      if (!isMousePointer(event)) return;
      markPositioned(event.clientX, event.clientY);
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    // `pointerover` fires for every element the pointer enters, so resolving
    // the closest tagged ancestor on each one both picks up a target and clears
    // it again once the pointer reaches untagged markup.
    const handleOver = (event: PointerEvent) => {
      // A tap on a hybrid device never shows the bubble and dismisses a stale one.
      if (!isMousePointer(event)) {
        applyLabel(null);
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target.closest(`[${CURSOR_LABEL_ATTRIBUTE}]`)
          : null;
      const next = target?.getAttribute(CURSOR_LABEL_ATTRIBUTE) ?? null;

      if (next !== null && labelRef.current === null) {
        // Reappearing from hidden (mount, or re-entering the window straight
        // onto a row): appear at the pointer rather than swooping from the old
        // position.
        markPositioned(event.clientX, event.clientY);
        pointerX.jump(event.clientX);
        pointerY.jump(event.clientY);
        springX.jump(event.clientX);
        springY.jump(event.clientY);
      }

      applyLabel(next);
    };

    // Leaving the window fires no `pointerover`, so hide explicitly. (A touch
    // lift also reports a null relatedTarget, which correctly clears too.)
    const handleOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) applyLabel(null);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerover', handleOver);
    document.addEventListener('pointerout', handleOut);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerover', handleOver);
      document.removeEventListener('pointerout', handleOut);
      hasPositionRef.current = false;
    };
  }, [hasFinePointer, pointerX, pointerY, springX, springY]);

  if (!hasFinePointer) return null;

  const isActive = label !== null && label.length > 0;

  return (
    <motion.div
      aria-hidden="true"
      data-testid="cursor-follower"
      className={cn(
        // Sits ABOVE the pointer, not centred on it: centred, the pill covered
        // the very row title the reader is trying to read. `-translate-y-full`
        // lifts it clear by its own height, and the extra gap keeps it off the
        // OS cursor glyph (which stays visible, see globals.css).
        'pointer-events-none fixed left-0 top-0 z-[100] inline-flex h-[42px] -translate-x-1/2 -translate-y-[calc(100%+14px)] items-center gap-2 whitespace-nowrap rounded-full bg-[#181818] px-5 text-base font-normal leading-none text-white',
        className
      )}
      style={{
        x: reduceMotion ? pointerX : springX,
        y: reduceMotion ? pointerY : springY,
      }}
      initial={false}
      animate={{
        scale: isActive ? 1 : 0,
        opacity: isActive ? ACTIVE_OPACITY : 0,
      }}
      transition={reduceMotion ? { duration: 0 } : POP_SPRING}
    >
      {label}
      <HiArrowLongRight className="size-6 shrink-0" aria-hidden="true" />
    </motion.div>
  );
}

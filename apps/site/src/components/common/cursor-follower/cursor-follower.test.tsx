// Copyright © Todd Agriscience, Inc. All rights reserved.

import { stubMatchMedia } from '@/test/stub-match-media';
import { fireEvent, renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CURSOR_READY_ATTRIBUTE } from './constants';
import { CursorFollower } from './cursor-follower';

function renderWithTarget() {
  return renderWithNextIntl(
    <>
      <a href="#row" data-cursor-label="Read">
        Row
      </a>
      <p>Untagged copy</p>
      <CursorFollower />
    </>
  );
}

/** Dispatches a pointer-family event carrying an explicit `pointerType`. */
function dispatchWithPointerType(
  element: Element,
  type: string,
  pointerType: string
) {
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  act(() => {
    element.dispatchEvent(event);
  });
}

describe('CursorFollower', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute(CURSOR_READY_ATTRIBUTE);
  });

  it('renders nothing without a fine pointer (touch devices)', () => {
    stubMatchMedia(false);
    renderWithTarget();

    expect(screen.queryByTestId('cursor-follower')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute(
      CURSOR_READY_ATTRIBUTE
    );
  });

  it('hides the native cursor only after a real pointer position is known', () => {
    stubMatchMedia(true);
    renderWithTarget();

    // Mounted, but no pointer event yet: the OS cursor must stay visible.
    expect(screen.getByTestId('cursor-follower')).toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute(
      CURSOR_READY_ATTRIBUTE
    );

    fireEvent.pointerMove(window, { clientX: 40, clientY: 40 });
    expect(document.documentElement).toHaveAttribute(CURSOR_READY_ATTRIBUTE);
  });

  it('shows the hovered target label and clears it over untagged markup', () => {
    stubMatchMedia(true);
    renderWithTarget();

    const follower = screen.getByTestId('cursor-follower');
    expect(follower).toHaveAttribute('aria-hidden', 'true');
    expect(follower).toHaveTextContent('');

    fireEvent.pointerOver(screen.getByText('Row'));
    expect(follower).toHaveTextContent('Read');
    expect(document.documentElement).toHaveAttribute(CURSOR_READY_ATTRIBUTE);

    fireEvent.pointerOver(screen.getByText('Untagged copy'));
    expect(follower).toHaveTextContent('');
  });

  it('renders as a pill with a trailing arrow, matching the Button geometry', () => {
    stubMatchMedia(true);
    renderWithTarget();

    const follower = screen.getByTestId('cursor-follower');

    // Pill, not a circle: rounded-full plus horizontal padding and an explicit
    // height, mirroring components/common/button/themes/button.tsx.
    expect(follower).toHaveClass('rounded-full', 'px-5', 'h-[42px]', 'gap-2');
    expect(follower.className).not.toMatch(/\bsize-\d/);

    // The arrow is decorative and must never join the accessible name.
    const arrow = follower.querySelector('svg');
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('hides when the pointer leaves the window but not on internal transitions', () => {
    stubMatchMedia(true);
    renderWithTarget();
    const follower = screen.getByTestId('cursor-follower');

    fireEvent.pointerOver(screen.getByText('Row'));
    expect(follower).toHaveTextContent('Read');

    // Moving to another element inside the document must NOT clear the label
    // (the next pointerover decides), only leaving the window does.
    fireEvent.pointerOut(screen.getByText('Row'), {
      relatedTarget: screen.getByText('Untagged copy'),
    });
    expect(follower).toHaveTextContent('Read');

    fireEvent.pointerOut(screen.getByText('Row'), { relatedTarget: null });
    expect(follower).toHaveTextContent('');
  });

  it('ignores touch input on hybrid fine-pointer devices', () => {
    stubMatchMedia(true);
    renderWithTarget();
    const follower = screen.getByTestId('cursor-follower');
    const row = screen.getByText('Row');

    // A tap on a row must not show the bubble.
    dispatchWithPointerType(row, 'pointerover', 'touch');
    expect(follower).toHaveTextContent('');
    expect(document.documentElement).not.toHaveAttribute(
      CURSOR_READY_ATTRIBUTE
    );

    // A tap while the bubble is showing (from earlier mouse hover) dismisses it.
    fireEvent.pointerOver(row);
    expect(follower).toHaveTextContent('Read');
    dispatchWithPointerType(row, 'pointerover', 'touch');
    expect(follower).toHaveTextContent('');
  });

  it('removes the ready attribute when unmounted', () => {
    stubMatchMedia(true);
    const { unmount } = renderWithTarget();

    fireEvent.pointerOver(screen.getByText('Row'));
    expect(document.documentElement).toHaveAttribute(CURSOR_READY_ATTRIBUTE);

    unmount();
    expect(document.documentElement).not.toHaveAttribute(
      CURSOR_READY_ATTRIBUTE
    );
  });
});

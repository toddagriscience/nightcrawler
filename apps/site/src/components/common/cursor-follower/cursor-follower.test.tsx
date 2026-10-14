// Copyright © Todd Agriscience, Inc. All rights reserved.

import { stubMatchMedia } from '@/test/stub-match-media';
import { fireEvent, renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  });

  it('renders nothing without a fine pointer (touch devices)', () => {
    stubMatchMedia(false);
    renderWithTarget();

    expect(screen.queryByTestId('cursor-follower')).not.toBeInTheDocument();
  });

  it('shows the hovered target label and clears it over untagged markup', () => {
    stubMatchMedia(true);
    renderWithTarget();

    const follower = screen.getByTestId('cursor-follower');
    expect(follower).toHaveAttribute('aria-hidden', 'true');
    expect(follower).toHaveTextContent('');

    fireEvent.pointerOver(screen.getByText('Row'));
    expect(follower).toHaveTextContent('Read');

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

    // A tap while the bubble is showing (from earlier mouse hover) dismisses it.
    fireEvent.pointerOver(row);
    expect(follower).toHaveTextContent('Read');
    dispatchWithPointerType(row, 'pointerover', 'touch');
    expect(follower).toHaveTextContent('');
  });
});

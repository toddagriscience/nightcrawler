// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdvisorContactButton } from './advisor-contact-button';
import type { InferenceContactResult } from '@/app/(authenticated)/(shell)/(misc)/support/contact/types';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
beforeEach(() => vi.clearAllMocks());

describe('AdvisorContactButton', () => {
  it('sends original questions and zone to the action before navigating to its opaque URL', async () => {
    const prepare = vi.fn().mockResolvedValue({
      success: true,
      url: '/support/contact?context=opaque-id',
    });
    const transferred = vi.fn();
    render(
      <AdvisorContactButton
        questions={['Original question', 'Follow-up']}
        managementZoneId={12}
        prepareAction={prepare}
        onTransferred={transferred}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Contact an advisor' }));
    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith(
        '/support/contact?context=opaque-id'
      )
    );
    expect(prepare).toHaveBeenCalledWith({
      questions: ['Original question', 'Follow-up'],
      managementZoneId: 12,
    });
    expect(transferred).toHaveBeenCalledTimes(1);
  });

  it('keeps the questions in place and allows retry after a returned failure', async () => {
    const prepare = vi
      .fn()
      .mockResolvedValue({ success: false, message: 'Please try again.' });
    render(
      <AdvisorContactButton
        questions={['Original question']}
        prepareAction={prepare}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Contact an advisor' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please try again.'
    );
    expect(mocks.push).not.toHaveBeenCalled();
    prepare.mockResolvedValue({
      success: true,
      url: '/support/contact?context=opaque-id',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Contact an advisor' }));
    await waitFor(() => expect(mocks.push).toHaveBeenCalledOnce());
    expect(prepare).toHaveBeenLastCalledWith({
      questions: ['Original question'],
      managementZoneId: undefined,
    });
  });

  it('reports transport errors without navigating away', async () => {
    const prepare = vi.fn().mockRejectedValue(new Error('Network error'));
    render(
      <AdvisorContactButton questions={['Question']} prepareAction={prepare} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Contact an advisor' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'questions could not be transferred'
    );
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('blocks duplicate transfers while the action is pending', async () => {
    let resolve!: (result: InferenceContactResult) => void;
    const prepare = vi.fn(
      () =>
        new Promise<InferenceContactResult>((done) => {
          resolve = done;
        })
    );
    render(
      <AdvisorContactButton questions={['Question']} prepareAction={prepare} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Contact an advisor' }));
    const button = screen.getByRole('button', { name: 'Transferring…' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(prepare).toHaveBeenCalledTimes(1);
    resolve({ success: true, url: '/support/contact?context=opaque-id' });
    await waitFor(() => expect(mocks.push).toHaveBeenCalledOnce());
  });
});

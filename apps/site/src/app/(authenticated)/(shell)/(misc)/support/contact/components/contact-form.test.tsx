// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './contact-form';
import type { ContactResult } from '../types';

const identity = {
  senderName: 'Alex Client',
  senderEmail: 'alex@example.test',
  farmName: 'Green Acres',
};

describe('ContactForm', () => {
  it('prefills transferred questions, permits review edits, and starts a fresh request after sending a single-use draft', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ success: true, id: 42 });
    render(
      <ContactForm
        {...identity}
        initialValues={{
          subject: 'Question from inference search',
          message: '1. Original question\n\n2. Follow-up',
        }}
        anotherMessageHref="/support/contact"
        submitAction={action}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue(
      '1. Original question\n\n2. Follow-up'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Message' }),
      '\nAdditional detail.'
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(action).toHaveBeenCalledWith({
      subject: 'Question from inference search',
      message: '1. Original question\n\n2. Follow-up\nAdditional detail.',
    });
    expect(
      await screen.findByRole('link', { name: 'Send another message' })
    ).toHaveAttribute('href', '/support/contact');
  });
  it('labels the fields and prevents empty messages from reaching the server', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(<ContactForm {...identity} submitAction={action} />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Enter a subject.')).toBeInTheDocument();
    expect(screen.getByText('Enter a message.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Subject' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(action).not.toHaveBeenCalled();
  });

  it('shows a receipt only after delivery and resets for another message', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ success: true, id: 42 });
    render(<ContactForm {...identity} submitAction={action} />);
    await user.type(
      screen.getByRole('textbox', { name: 'Subject' }),
      '  Soil question  '
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Message' }),
      'Please review my results.'
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'request number is 42'
    );
    expect(action).toHaveBeenCalledWith({
      subject: 'Soil question',
      message: 'Please review my results.',
    });
    expect(screen.getByRole('status')).toHaveTextContent(identity.senderEmail);
    await user.click(
      screen.getByRole('button', { name: 'Send another message' })
    );
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
  });

  it.each(['returned', 'thrown'])(
    'retains the message after a %s failure',
    async (failure) => {
      const user = userEvent.setup();
      const action =
        failure === 'returned'
          ? vi.fn().mockResolvedValue({
              success: false,
              message: 'Please try again later.',
            })
          : vi.fn().mockRejectedValue(new Error('network failed'));
      render(<ContactForm {...identity} submitAction={action} />);
      await user.type(
        screen.getByRole('textbox', { name: 'Subject' }),
        'Question'
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Message' }),
        'Please review my results.'
      );
      await user.click(screen.getByRole('button', { name: 'Send message' }));
      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue(
        'Please review my results.'
      );
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    }
  );

  it('blocks repeated submissions while a message is being sent', async () => {
    const user = userEvent.setup();
    let complete: (result: ContactResult) => void = () => {};
    const action = vi.fn(
      () =>
        new Promise<ContactResult>((resolve) => {
          complete = resolve;
        })
    );
    render(<ContactForm {...identity} submitAction={action} />);
    await user.type(
      screen.getByRole('textbox', { name: 'Subject' }),
      'Question'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Message' }),
      'Please help.'
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    const sending = screen.getByRole('button', { name: 'Sending…' });
    expect(sending).toBeDisabled();
    await user.click(sending);
    expect(action).toHaveBeenCalledTimes(1);
    complete({ success: true, id: 42 });
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Message sent.')
    );
  });
});

// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
const upload = vi.hoisted(() => vi.fn());
vi.mock('@/features/imp-diagrams/actions', () => ({
  uploadImpDiagram: upload,
}));
import { DiagramUpload } from './diagram-upload';
beforeEach(() => vi.resetAllMocks());
it('does not publish an IMP and retains the selection/description on an upload error', async () => {
  const insert = vi.fn();
  upload.mockResolvedValue({ ok: false, error: 'Storage unavailable.' });
  render(<DiagramUpload onUploaded={insert} />);
  fireEvent.change(screen.getByLabelText('Diagram image'), {
    target: {
      files: [new File(['image'], 'diagram.png', { type: 'image/png' })],
    },
  });
  fireEvent.change(screen.getByLabelText('Diagram description (alt text)'), {
    target: { value: 'Soil range diagram' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Upload and insert diagram' })
  );
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Storage unavailable.')
  );
  expect(screen.getByLabelText('Diagram description (alt text)')).toHaveValue(
    'Soil range diagram'
  );
  expect(insert).not.toHaveBeenCalled();
});
it('inserts Markdown only after a successful upload', async () => {
  const insert = vi.fn();
  upload.mockResolvedValue({
    ok: true,
    markdown: '![Scale](/api/imp-diagrams/test.png)',
  });
  render(<DiagramUpload onUploaded={insert} />);
  fireEvent.change(screen.getByLabelText('Diagram image'), {
    target: { files: [new File(['image'], 'diagram.png')] },
  });
  fireEvent.change(screen.getByLabelText('Diagram description (alt text)'), {
    target: { value: 'Scale' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Upload and insert diagram' })
  );
  await waitFor(() =>
    expect(insert).toHaveBeenCalledWith('![Scale](/api/imp-diagrams/test.png)')
  );
});

it('resets only the uploader, retaining edits and appended Markdown in the surrounding IMP form', async () => {
  upload.mockResolvedValue({
    ok: true,
    markdown: '![Scale](/api/imp-diagrams/test.png)',
  });
  function ImpForm() {
    const { register, getValues, setValue } = useForm({
      defaultValues: { title: 'Original title', body: 'Original advice' },
    });
    return (
      <form>
        <input aria-label="IMP title" {...register('title')} />
        <textarea aria-label="IMP body" {...register('body')} />
        <DiagramUpload
          onUploaded={(markdown) =>
            setValue('body', `${getValues('body')}\n\n${markdown}`)
          }
        />
      </form>
    );
  }
  render(<ImpForm />);
  fireEvent.change(screen.getByLabelText('IMP title'), {
    target: { value: 'Edited title' },
  });
  fireEvent.change(screen.getByLabelText('IMP body'), {
    target: { value: 'Edited advice' },
  });
  fireEvent.change(screen.getByLabelText('Diagram image'), {
    target: { files: [new File(['image'], 'diagram.png')] },
  });
  fireEvent.change(screen.getByLabelText('Diagram description (alt text)'), {
    target: { value: 'Scale' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Upload and insert diagram' })
  );
  await waitFor(() =>
    expect(screen.getByLabelText('Diagram description (alt text)')).toHaveValue(
      ''
    )
  );
  expect(screen.getByLabelText('IMP title')).toHaveValue('Edited title');
  expect(screen.getByLabelText('IMP body')).toHaveValue(
    'Edited advice\n\n![Scale](/api/imp-diagrams/test.png)'
  );
});

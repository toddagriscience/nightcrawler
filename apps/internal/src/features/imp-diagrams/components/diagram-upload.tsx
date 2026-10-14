// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useForm } from 'react-hook-form';
import { uploadImpDiagram } from '@/features/imp-diagrams/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Manual diagram upload; it does not submit the surrounding IMP editor form. */
export function DiagramUpload({
  onUploaded,
}: {
  onUploaded: (markdown: string) => void;
}) {
  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<{ file: FileList; alt: string }>({ defaultValues: { alt: '' } });
  const submit = handleSubmit(async ({ file, alt }) => {
    if (!file?.[0]) {
      setError('file', { message: 'Choose an image.' });
      return;
    }
    const data = new FormData();
    data.set('file', file[0]);
    data.set('alt', alt);
    try {
      const result = await uploadImpDiagram(data);
      if (!result.ok) {
        setError('root', { message: result.error });
        return;
      }
      onUploaded(result.markdown);
      // A whole-form reset would reset the surrounding native IMP form.
      resetField('file');
      resetField('alt');
    } catch {
      setError('root', { message: 'Unable to upload the diagram. Try again.' });
    }
  });
  return (
    <fieldset className="space-y-3 rounded border p-4" disabled={isSubmitting}>
      <legend className="px-1 text-sm font-medium">Insert a diagram</legend>
      <p className="text-xs text-muted-foreground">
        PNG, JPEG or WebP, up to 512 KiB. Upload adds Markdown to the body; save
        the IMP afterward. The image stays in private storage.
      </p>
      <div className="space-y-1">
        <Label htmlFor="imp-diagram-file">Diagram image</Label>
        <Input
          id="imp-diagram-file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          {...register('file')}
        />
        {errors.file && <p role="alert">{errors.file.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="imp-diagram-alt">Diagram description (alt text)</Label>
        <Input
          id="imp-diagram-alt"
          {...register('alt', {
            required: 'Describe the diagram.',
            maxLength: { value: 1000, message: 'Use at most 1000 characters.' },
          })}
        />
        {errors.alt && <p role="alert">{errors.alt.message}</p>}
      </div>
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <Button type="button" variant="outline" onClick={() => void submit()}>
        {isSubmitting ? 'Uploading…' : 'Upload and insert diagram'}
      </Button>
    </fieldset>
  );
}

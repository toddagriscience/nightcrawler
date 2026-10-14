// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useForm, useWatch } from 'react-hook-form';
import { ImpMarkdown as ReactMarkdown } from '@/features/imp-diagrams/components/imp-markdown';
import { DiagramUpload } from '@/features/imp-diagrams/components/diagram-upload';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { saveGeneralImp } from '@/app/(dashboard)/imps/catalog/actions';
import type {
  GeneralImp,
  GeneralImpFields,
} from '@/app/(dashboard)/imps/catalog/types';

/** Editor for an imported practice; search metadata and timestamps are server-owned. */
export function CatalogEditor({
  imp,
  onClose,
  onSaved,
}: {
  imp: GeneralImp | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const {
    register,
    getValues,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneralImpFields>({
    defaultValues: {
      title: imp?.title ?? '',
      slug: imp?.slug ?? '',
      tags: imp?.tags.join(', ') ?? '',
      triggerRaw: imp?.triggerRaw ?? '',
      content: imp?.content ?? '',
    },
  });
  const content = useWatch({ control, name: 'content' });
  const submit = async (fields: GeneralImpFields) => {
    try {
      const result = await saveGeneralImp(
        fields,
        imp
          ? { id: imp.id, updatedAt: new Date(imp.updatedAt).toISOString() }
          : undefined
      );
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(imp ? 'General IMP updated.' : 'General IMP created.');
      onClose();
      await onSaved();
    } catch {
      toast.error('Unable to save the IMP. Try again.');
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {imp ? 'Edit general IMP' : 'Create general IMP'}
          </DialogTitle>
          <DialogDescription>
            Changes are live in the catalog. Copy them to the source spreadsheet
            before the next import, which reconciles and may overwrite or remove
            these rows.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imp-title">Descriptive heading (optional)</Label>
            <Input id="imp-title" {...register('title', { maxLength: 300 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imp-slug">Slug</Label>
            <Input
              id="imp-slug"
              readOnly={Boolean(imp)}
              {...register('slug', {
                required: 'Slug is required.',
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: 'Use lowercase letters, numbers and hyphens.',
                },
                maxLength: 300,
              })}
            />
            {errors.slug && <p role="alert">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">
              Existing slugs stay fixed to preserve client links. New slugs must
              match the importer’s title/category-based slug; confirm with a dry
              run.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imp-tags">Category tags (comma separated)</Label>
            <Input id="imp-tags" {...register('tags')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imp-trigger">Trigger / range (optional)</Label>
            <Input
              id="imp-trigger"
              placeholder="low @zinc"
              {...register('triggerRaw')}
            />
            <p className="text-xs text-muted-foreground">
              Use low @name, ideal @name or high @name for range columns. Blank
              means a reference concept. Other expressions stay verbatim.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imp-content">Body (Markdown)</Label>
            <Textarea
              id="imp-content"
              rows={8}
              {...register('content', {
                required: 'Body is required.',
                maxLength: 100000,
              })}
            />
            {errors.content && <p role="alert">{errors.content.message}</p>}
          </div>
          <DiagramUpload
            onUploaded={(markdown) =>
              setValue(
                'content',
                `${getValues('content') || ''}\n\n${markdown}`,
                { shouldDirty: true }
              )
            }
          />
          <details>
            <summary className="cursor-pointer">Markdown preview</summary>
            <div className="prose prose-sm max-w-none rounded border p-4">
              <ReactMarkdown>{content || '*No content*'}</ReactMarkdown>
            </div>
          </details>
          {imp && (
            <p className="text-xs text-muted-foreground">
              Last edited: {new Date(imp.updatedAt).toLocaleString()}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save general IMP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

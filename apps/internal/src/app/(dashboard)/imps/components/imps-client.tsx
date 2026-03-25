// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import { getImps, createImp, updateImp, deleteImp } from '../actions';

/** IMP categories */
const IMP_CATEGORIES = [
  'soil',
  'planting',
  'water',
  'insects_disease',
  'harvest_storage',
  'go_to_market',
  'seed_products',
] as const;

/** Form data for IMP CRUD */
interface ImpFormData {
  knowledgeArticleId: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  source: string;
  managementZone: number;
  analysis: string;
  plan: string;
  initialized: string;
  updated: string;
}

/** Props for the IMPs client component */
interface ImpsClientProps {
  initialImps: any[];
}

/**
 * Client component for IMPs management.
 * Supports CRUD operations and markdown content preview.
 */
export default function ImpsClient({ initialImps }: ImpsClientProps) {
  const [imps, setImps] = useState<any[]>(initialImps);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [editing, setEditing] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ImpFormData>();

  const contentValue = useWatch({ control, name: 'content' });

  const load = useCallback(async (search?: string) => {
    setImps(await getImps(search));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      knowledgeArticleId: 0,
      title: '',
      slug: '',
      content: '',
      category: 'soil',
      source: '',
      managementZone: 0,
      analysis: '',
      plan: '',
      initialized: new Date().toISOString().split('T')[0],
      updated: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      knowledgeArticleId: record.knowledgeArticleId,
      title: record.title,
      slug: record.slug,
      content: record.content,
      category: record.category,
      source: record.source ?? '',
      managementZone: record.managementZone ?? 0,
      analysis: record.analysis ?? '',
      plan: record.plan ?? '',
      initialized: record.initialized
        ? new Date(record.initialized).toISOString().split('T')[0]
        : '',
      updated: record.updated
        ? new Date(record.updated).toISOString().split('T')[0]
        : '',
    });
    setDialogOpen(true);
  };

  const openPreview = (record: any) => {
    setPreviewTitle(record.title);
    setPreviewContent(record.content);
    setPreviewOpen(true);
  };

  const onSubmit = async (data: ImpFormData) => {
    if (editing) {
      const result = await updateImp(editing.id, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category as (typeof IMP_CATEGORIES)[number],
        source: data.source || undefined,
        managementZone: Number(data.managementZone) || undefined,
        analysis: data.analysis || undefined,
        plan: data.plan || undefined,
        updated: data.updated || new Date().toISOString().split('T')[0],
      });
      result
        ? toast.success('IMP updated.')
        : toast.error('Failed to update IMP.');
    } else {
      const result = await createImp({
        knowledgeArticleId: Number(data.knowledgeArticleId),
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category as (typeof IMP_CATEGORIES)[number],
        source: data.source || undefined,
        managementZone: Number(data.managementZone) || undefined,
        analysis: data.analysis || undefined,
        plan: data.plan || undefined,
        initialized: data.initialized,
        updated: data.updated || undefined,
      });
      result
        ? toast.success('IMP created.')
        : toast.error('Failed to create IMP.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this IMP?')) return;
    (await deleteImp(id))
      ? toast.success('IMP deleted.')
      : toast.error('Failed to delete IMP.');
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrated Management Plans"
        description="Manage, preview, and create IMPs."
        onSearch={(query) => load(query || undefined)}
        searchPlaceholder="Search IMPs..."
      />

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New IMP
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Initialized</TableHead>
              <TableHead className="w-[130px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {imps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No IMPs found.
                </TableCell>
              </TableRow>
            ) : (
              imps.map((imp: any) => (
                <TableRow key={imp.id}>
                  <TableCell>{imp.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {imp.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {imp.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{imp.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {imp.initialized
                      ? new Date(imp.initialized).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openPreview(imp)}
                        aria-label="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(imp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(imp.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
            <DialogDescription>Markdown preview</DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{previewContent}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit IMP' : 'Create IMP'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update IMP details.'
                : 'Add a new integrated management plan.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <Label>Knowledge Article ID</Label>
                <Input
                  type="number"
                  {...register('knowledgeArticleId', {
                    required: 'Knowledge article ID is required',
                  })}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Tabs defaultValue="edit">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    rows={10}
                    {...register('content', {
                      required: 'Content is required',
                    })}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="min-h-[200px] rounded-md border p-4 prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {contentValue || '*No content*'}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  {...register('category')}
                >
                  {IMP_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input {...register('source')} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Management Zone ID</Label>
                <Input type="number" {...register('managementZone')} />
              </div>
              <div className="space-y-2">
                <Label>Analysis ID</Label>
                <Input {...register('analysis')} />
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Input {...register('plan')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Initialized</Label>
                <Input type="date" {...register('initialized')} />
              </div>
              <div className="space-y-2">
                <Label>Updated</Label>
                <Input type="date" {...register('updated')} />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

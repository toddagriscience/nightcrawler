// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import {
  getSeedProducts,
  createSeedProduct,
  updateSeedProduct,
  deleteSeedProduct,
} from '../actions';

/** Form data for seed product CRUD */
interface SeedProductFormData {
  knowledgeArticleId: number;
  name: string;
  slug: string;
  description: string;
  stock: number;
  priceInCents: number;
  unit: string;
  imageUrl: string;
  advisorContactUrl: string;
  relatedIntegratedManagementPlanId: number;
}

/** Props for the seed products client component */
interface SeedProductsClientProps {
  initialProducts: any[];
}

/**
 * Client component for seed products management.
 * Supports full CRUD operations for seed products.
 */
export default function SeedProductsClient({
  initialProducts,
}: SeedProductsClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SeedProductFormData>();

  const load = useCallback(async (search?: string) => {
    setProducts(await getSeedProducts(search));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      knowledgeArticleId: 0,
      name: '',
      slug: '',
      description: '',
      stock: 0,
      priceInCents: 0,
      unit: 'lb',
      imageUrl: '',
      advisorContactUrl: '/contact',
      relatedIntegratedManagementPlanId: 0,
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      knowledgeArticleId: record.knowledgeArticleId,
      name: record.name,
      slug: record.slug,
      description: record.description,
      stock: record.stock,
      priceInCents: record.priceInCents,
      unit: record.unit ?? 'lb',
      imageUrl: record.imageUrl ?? '',
      advisorContactUrl: record.advisorContactUrl ?? '/contact',
      relatedIntegratedManagementPlanId:
        record.relatedIntegratedManagementPlanId ?? 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: SeedProductFormData) => {
    const payload = {
      ...data,
      stock: Number(data.stock),
      priceInCents: Number(data.priceInCents),
      knowledgeArticleId: Number(data.knowledgeArticleId),
      imageUrl: data.imageUrl || undefined,
      advisorContactUrl: data.advisorContactUrl || undefined,
      relatedIntegratedManagementPlanId:
        Number(data.relatedIntegratedManagementPlanId) || undefined,
    };
    if (editing) {
      const result = await updateSeedProduct(editing.id, payload);
      result
        ? toast.success('Product updated.')
        : toast.error('Failed to update product.');
    } else {
      const result = await createSeedProduct(payload);
      result
        ? toast.success('Product created.')
        : toast.error('Failed to create product.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this seed product?')) return;
    (await deleteSeedProduct(id))
      ? toast.success('Product deleted.')
      : toast.error('Failed to delete product.');
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seed Products"
        description="Manage seed products available on the platform."
        onSearch={(query) => load(query || undefined)}
        searchPlaceholder="Search products..."
      />

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-[130px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No seed products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                  <TableCell>${(p.priceInCents / 100).toFixed(2)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/product/${p.slug}`}
                          aria-label={`View details for ${p.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update seed product details.'
                : 'Add a new seed product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <Label>Knowledge Article ID</Label>
                <Input
                  type="number"
                  {...register('knowledgeArticleId', {
                    required: 'Required',
                  })}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  {...register('slug', { required: 'Slug is required' })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                {...register('description', {
                  required: 'Description is required',
                })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (cents)</Label>
                <Input
                  type="number"
                  {...register('priceInCents', {
                    required: 'Price is required',
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" {...register('stock')} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input {...register('unit')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input {...register('imageUrl')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Advisor Contact URL</Label>
                <Input {...register('advisorContactUrl')} />
              </div>
              <div className="space-y-2">
                <Label>Related IMP ID</Label>
                <Input
                  type="number"
                  {...register('relatedIntegratedManagementPlanId')}
                />
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

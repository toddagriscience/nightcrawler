// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
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
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import {
  getAnalyses,
  createAnalysis,
  updateAnalysis,
  deleteAnalysis,
} from '../actions';

/** Mineral type options */
const MINERAL_TYPES = [
  'Calcium',
  'Magnesium',
  'Sodium',
  'Potassium',
  'PH',
  'Salinity',
  'NitrateNitrogen',
  'PhosphatePhosphorus',
  'Zinc',
  'Iron',
  'OrganicMatter',
] as const;

/** Unit type options */
const UNIT_TYPES = ['ppm', '%'] as const;

/** Shape of an analysis record */
interface AnalysisRecord {
  id: string;
  managementZone: number;
  analysisDate: Date;
  summary: string | null;
  macroActionableInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Form data for creating an analysis */
interface AnalysisFormData {
  id: string;
  managementZone: number;
  analysisDate: string;
  summary: string;
  macroActionableInfo: string;
  minerals: Array<{
    name: string;
    realValue: number;
    units: string;
    actionableInfo: string;
  }>;
}

/** Props for the analyses client component */
interface AnalysesClientProps {
  initialAnalyses: AnalysisRecord[];
}

/**
 * Client component for analyses management.
 * Supports creating analyses with per-mineral data entry, editing, and deleting.
 */
export default function AnalysesClient({
  initialAnalyses,
}: AnalysesClientProps) {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>(initialAnalyses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState<AnalysisRecord | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AnalysisFormData>({
    defaultValues: {
      minerals: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'minerals',
  });

  const loadAnalyses = useCallback(async (search?: string) => {
    const data = await getAnalyses(search);
    setAnalyses(data as AnalysisRecord[]);
  }, []);

  const openCreateDialog = () => {
    setEditingAnalysis(null);
    reset({
      id: '',
      managementZone: 0,
      analysisDate: '',
      summary: '',
      macroActionableInfo: '',
      minerals: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (record: AnalysisRecord) => {
    setEditingAnalysis(record);
    reset({
      id: record.id,
      managementZone: record.managementZone,
      analysisDate: new Date(record.analysisDate).toISOString().split('T')[0],
      summary: record.summary ?? '',
      macroActionableInfo: record.macroActionableInfo ?? '',
      minerals: [],
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: AnalysisFormData) => {
    if (editingAnalysis) {
      const result = await updateAnalysis(editingAnalysis.id, {
        analysisDate: data.analysisDate,
        summary: data.summary,
        macroActionableInfo: data.macroActionableInfo,
      });
      if (result) {
        toast.success('Analysis updated successfully.');
      } else {
        toast.error('Failed to update analysis.');
        return;
      }
    } else {
      const result = await createAnalysis({
        id: data.id,
        managementZone: Number(data.managementZone),
        analysisDate: data.analysisDate,
        summary: data.summary || undefined,
        macroActionableInfo: data.macroActionableInfo || undefined,
        minerals: data.minerals.map((m) => ({
          name: m.name as (typeof MINERAL_TYPES)[number],
          realValue: Number(m.realValue),
          units: m.units as 'ppm' | '%',
          actionableInfo: m.actionableInfo || undefined,
        })),
      });
      if (result) {
        toast.success('Analysis created successfully.');
      } else {
        toast.error('Failed to create analysis.');
        return;
      }
    }
    setDialogOpen(false);
    loadAnalyses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    const success = await deleteAnalysis(id);
    if (success) {
      toast.success('Analysis deleted successfully.');
      loadAnalyses();
    } else {
      toast.error('Failed to delete analysis.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyses"
        description="Manage soil analyses and mineral data."
        onSearch={(query) => loadAnalyses(query || undefined)}
        searchPlaceholder="Search analyses..."
      />

      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No analyses found.
                </TableCell>
              </TableRow>
            ) : (
              analyses.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">
                    {record.id}
                  </TableCell>
                  <TableCell>{record.managementZone}</TableCell>
                  <TableCell>
                    {new Date(record.analysisDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {record.summary ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(record)}
                        aria-label={`Edit analysis ${record.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                        aria-label={`Delete analysis ${record.id}`}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnalysis ? 'Edit Analysis' : 'Create Analysis'}
            </DialogTitle>
            <DialogDescription>
              {editingAnalysis
                ? 'Update analysis details.'
                : 'Create a new analysis with mineral data.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analysisId">Analysis ID</Label>
                <Input
                  id="analysisId"
                  placeholder="XXXXXX-XXXXXX"
                  disabled={!!editingAnalysis}
                  {...register('id', { required: 'ID is required' })}
                />
                {errors.id && (
                  <p className="text-sm text-destructive">
                    {errors.id.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="managementZone">Management Zone ID</Label>
                <Input
                  id="managementZone"
                  type="number"
                  disabled={!!editingAnalysis}
                  {...register('managementZone', {
                    required: 'Zone is required',
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="analysisDate">Analysis Date</Label>
              <Input
                id="analysisDate"
                type="date"
                {...register('analysisDate', { required: 'Date is required' })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" rows={2} {...register('summary')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="macroActionableInfo">Macro Actionable Info</Label>
              <Textarea
                id="macroActionableInfo"
                rows={2}
                {...register('macroActionableInfo')}
              />
            </div>

            {!editingAnalysis && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Minerals</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        name: 'Calcium',
                        realValue: 0,
                        units: 'ppm',
                        actionableInfo: '',
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Mineral
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_1fr_80px_1fr_32px] gap-2 items-end"
                  >
                    <div>
                      <Label className="text-xs">Type</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        {...register(`minerals.${index}.name`)}
                      >
                        {MINERAL_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Value</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        {...register(`minerals.${index}.realValue`)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Unit</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        {...register(`minerals.${index}.units`)}
                      >
                        {UNIT_TYPES.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Info</Label>
                      <Input
                        {...register(`minerals.${index}.actionableInfo`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-5"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingAnalysis
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

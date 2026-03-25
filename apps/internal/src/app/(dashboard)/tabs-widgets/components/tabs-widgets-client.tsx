// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  getTabs,
  createTab,
  deleteTab,
  getWidgets,
  createWidget,
  updateWidget,
  deleteWidget,
} from '../actions';

/** Widget type options */
const WIDGET_TYPES = [
  'Macro Radar',
  'Calcium Widget',
  'PH Widget',
  'Salinity Widget',
  'Magnesium Widget',
  'Sodium Widget',
  'Nitrate Nitrogen Widget',
  'Phosphate Phosphorus Widget',
  'Potassium Widget',
  'Zinc Widget',
  'Iron Widget',
  'Organic Matter Widget',
  'Insights',
] as const;

/** Props for the tabs & widgets client component */
interface TabsWidgetsClientProps {
  initialTabs: any[];
  initialWidgets: any[];
}

/**
 * Client component for tabs & widgets management.
 * Manages user tab-to-zone mappings and widget configurations.
 */
export default function TabsWidgetsClient({
  initialTabs,
  initialWidgets,
}: TabsWidgetsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tabs & Widgets</h1>
        <p className="text-sm text-muted-foreground">
          Manage user tabs and widget configurations.
        </p>
      </div>

      <Tabs defaultValue="tabs">
        <TabsList>
          <TabsTrigger value="tabs">Tabs</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="tabs">
          <TabsTab initialData={initialTabs} />
        </TabsContent>
        <TabsContent value="widgets">
          <WidgetsTab initialData={initialWidgets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ──────────────────────────── TABS SECTION ────────────────────────────

/** Form data for tab creation */
interface TabFormData {
  user: number;
  managementZone: number;
}

/** Tabs sub-tab component */
function TabsTab({ initialData }: { initialData: any[] }) {
  const [tabs, setTabs] = useState<any[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TabFormData>();

  const load = useCallback(async () => {
    setTabs(await getTabs());
  }, []);

  const openCreate = () => {
    reset({ user: 0, managementZone: 0 });
    setDialogOpen(true);
  };

  const onSubmit = async (data: TabFormData) => {
    const result = await createTab({
      user: Number(data.user),
      managementZone: Number(data.managementZone),
    });
    result
      ? toast.success('Tab created.')
      : toast.error('Failed to create tab.');
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this tab?')) return;
    (await deleteTab(id))
      ? toast.success('Tab deleted.')
      : toast.error('Failed to delete tab.');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Tab
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Management Zone ID</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No tabs found.
                </TableCell>
              </TableRow>
            ) : (
              tabs.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.user}</TableCell>
                  <TableCell>{t.managementZone}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Tab</DialogTitle>
            <DialogDescription>
              Assign a management zone tab to a user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  type="number"
                  {...register('user', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Management Zone ID</Label>
                <Input
                  type="number"
                  {...register('managementZone', { required: true })}
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
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ──────────────────────────── WIDGETS SECTION ────────────────────────────

/** Form data for widget CRUD */
interface WidgetFormData {
  managementZone: number;
  name: string;
  metadataI: string;
  metadataX: number;
  metadataY: number;
}

/** Widgets sub-tab component */
function WidgetsTab({ initialData }: { initialData: any[] }) {
  const [widgets, setWidgets] = useState<any[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<WidgetFormData>();

  const load = useCallback(async () => {
    setWidgets(await getWidgets());
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      managementZone: 0,
      name: 'Macro Radar',
      metadataI: '',
      metadataX: 0,
      metadataY: 0,
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      managementZone: record.managementZone,
      name: record.name,
      metadataI: record.widgetMetadata?.i ?? '',
      metadataX: record.widgetMetadata?.x ?? 0,
      metadataY: record.widgetMetadata?.y ?? 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: WidgetFormData) => {
    const widgetMetadata = {
      i: data.metadataI,
      x: Number(data.metadataX),
      y: Number(data.metadataY),
    };

    if (editing) {
      const result = await updateWidget(editing.id, {
        managementZone: Number(data.managementZone),
        name: data.name as (typeof WIDGET_TYPES)[number],
        widgetMetadata,
      });
      result
        ? toast.success('Widget updated.')
        : toast.error('Failed to update widget.');
    } else {
      const result = await createWidget({
        managementZone: Number(data.managementZone),
        name: data.name as (typeof WIDGET_TYPES)[number],
        widgetMetadata,
      });
      result
        ? toast.success('Widget created.')
        : toast.error('Failed to create widget.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this widget?')) return;
    (await deleteWidget(id))
      ? toast.success('Widget deleted.')
      : toast.error('Failed to delete widget.');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Widget
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Zone ID</TableHead>
              <TableHead>Widget Type</TableHead>
              <TableHead>Position (x, y)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No widgets found.
                </TableCell>
              </TableRow>
            ) : (
              widgets.map((w: any) => (
                <TableRow key={w.id}>
                  <TableCell>{w.id}</TableCell>
                  <TableCell>{w.managementZone}</TableCell>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>
                    ({w.widgetMetadata?.x ?? 0}, {w.widgetMetadata?.y ?? 0})
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(w)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(w.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Widget' : 'Create Widget'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update widget configuration.'
                : 'Add a new widget to a management zone.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Management Zone ID</Label>
              <Input
                type="number"
                {...register('managementZone', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Widget Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register('name')}
              >
                {WIDGET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Metadata ID (i)</Label>
                <Input {...register('metadataI')} />
              </div>
              <div className="space-y-2">
                <Label>Position X</Label>
                <Input type="number" {...register('metadataX')} />
              </div>
              <div className="space-y-2">
                <Label>Position Y</Label>
                <Input type="number" {...register('metadataY')} />
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

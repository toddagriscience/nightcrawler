// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
  getManagementZones,
  createManagementZone,
  updateManagementZone,
  deleteManagementZone,
  getStandardValues,
  updateStandardValues,
  getFarmSubscriptions,
} from '../actions';

/** Props for the farms client component */
interface FarmsClientProps {
  initialFarms: any[];
  initialZones: any[];
  initialStandardValues: any[];
  initialSubscriptions: any[];
}

/**
 * Client component for farms management with tabs for farms, management zones,
 * standard values, and subscriptions.
 */
export default function FarmsClient({
  initialFarms,
  initialZones,
  initialStandardValues,
  initialSubscriptions,
}: FarmsClientProps) {
  const [activeTab, setActiveTab] = useState('farms');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Farms</h1>
        <p className="text-sm text-muted-foreground">
          Manage farms, management zones, standard values, and view
          subscriptions.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="farms">Farms</TabsTrigger>
          <TabsTrigger value="zones">Management Zones</TabsTrigger>
          <TabsTrigger value="standards">Standard Values</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="farms">
          <FarmsTab initialData={initialFarms} />
        </TabsContent>
        <TabsContent value="zones">
          <ZonesTab initialData={initialZones} />
        </TabsContent>
        <TabsContent value="standards">
          <StandardValuesTab initialData={initialStandardValues} />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsTab initialData={initialSubscriptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ──────────────────────────── FARMS TAB ────────────────────────────

/** Form data for farm CRUD */
interface FarmFormData {
  informalName: string;
  businessName: string;
  businessWebsite: string;
  managementStartDate: string;
  approved: boolean;
  stripeCustomerId: string;
}

/** Farms sub-tab component */
function FarmsTab({ initialData }: { initialData: any[] }) {
  const [farms, setFarms] = useState<any[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormData>();

  const load = useCallback(async (search?: string) => {
    setFarms(await getFarms(search));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      informalName: '',
      businessName: '',
      businessWebsite: '',
      managementStartDate: '',
      approved: false,
      stripeCustomerId: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      informalName: record.informalName ?? '',
      businessName: record.businessName ?? '',
      businessWebsite: record.businessWebsite ?? '',
      managementStartDate: record.managementStartDate ?? '',
      approved: record.approved ?? false,
      stripeCustomerId: record.stripeCustomerId ?? '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: FarmFormData) => {
    const payload = {
      ...data,
      managementStartDate: data.managementStartDate || undefined,
      stripeCustomerId: data.stripeCustomerId || undefined,
    };
    if (editing) {
      const result = await updateFarm(editing.id, payload);
      result
        ? toast.success('Farm updated.')
        : toast.error('Failed to update farm.');
    } else {
      const result = await createFarm(payload);
      result
        ? toast.success('Farm created.')
        : toast.error('Failed to create farm.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this farm?')) return;
    (await deleteFarm(id))
      ? toast.success('Farm deleted.')
      : toast.error('Failed to delete farm.');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-lg">
          <Input
            placeholder="Search farms..."
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                load((e.target as HTMLInputElement).value || undefined);
            }}
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Farm
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Informal Name</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No farms found.
                </TableCell>
              </TableRow>
            ) : (
              farms.map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.informalName ?? '—'}</TableCell>
                  <TableCell>{f.businessName ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={f.approved ? 'success' : 'secondary'}>
                      {f.approved ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(f)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(f.id)}
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
            <DialogTitle>{editing ? 'Edit Farm' : 'Create Farm'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update farm details.' : 'Add a new farm.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Informal Name</Label>
                <Input {...register('informalName')} />
              </div>
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input {...register('businessName')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business Website</Label>
              <Input {...register('businessWebsite')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Management Start Date</Label>
                <Input type="date" {...register('managementStartDate')} />
              </div>
              <div className="space-y-2">
                <Label>Stripe Customer ID</Label>
                <Input {...register('stripeCustomerId')} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="approved"
                {...register('approved')}
                className="h-4 w-4"
              />
              <Label htmlFor="approved">Approved</Label>
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

// ──────────────────────────── ZONES TAB ────────────────────────────

/** Form data for management zone CRUD */
interface ZoneFormData {
  farmId: number;
  name: string;
  npk: boolean;
  npkLastUsed: string;
  irrigation: boolean;
  waterConservation: boolean;
}

/** Management zones sub-tab component */
function ZonesTab({ initialData }: { initialData: any[] }) {
  const [zones, setZones] = useState<any[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ZoneFormData>();

  const load = useCallback(async (search?: string) => {
    setZones(await getManagementZones(search));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      farmId: 0,
      name: '',
      npk: false,
      npkLastUsed: '',
      irrigation: false,
      waterConservation: false,
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      farmId: record.farmId ?? 0,
      name: record.name ?? '',
      npk: record.npk ?? false,
      npkLastUsed: record.npkLastUsed
        ? new Date(record.npkLastUsed).toISOString().split('T')[0]
        : '',
      irrigation: record.irrigation ?? false,
      waterConservation: record.waterConservation ?? false,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ZoneFormData) => {
    const payload = {
      ...data,
      farmId: Number(data.farmId),
      npkLastUsed: data.npkLastUsed || undefined,
    };
    if (editing) {
      const result = await updateManagementZone(editing.id, payload);
      result
        ? toast.success('Zone updated.')
        : toast.error('Failed to update zone.');
    } else {
      const result = await createManagementZone(payload);
      result
        ? toast.success('Zone created.')
        : toast.error('Failed to create zone.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this management zone?')) return;
    (await deleteManagementZone(id))
      ? toast.success('Zone deleted.')
      : toast.error('Failed to delete zone.');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-lg">
          <Input
            placeholder="Search zones..."
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                load((e.target as HTMLInputElement).value || undefined);
            }}
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Zone
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Farm ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>NPK</TableHead>
              <TableHead>Irrigation</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No management zones found.
                </TableCell>
              </TableRow>
            ) : (
              zones.map((z: any) => (
                <TableRow key={z.id}>
                  <TableCell>{z.id}</TableCell>
                  <TableCell>{z.farmId ?? '—'}</TableCell>
                  <TableCell>{z.name ?? '—'}</TableCell>
                  <TableCell>{z.npk ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{z.irrigation ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(z)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(z.id)}
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
            <DialogTitle>{editing ? 'Edit Zone' : 'Create Zone'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update management zone details.'
                : 'Add a new management zone.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Farm ID</Label>
                <Input type="number" {...register('farmId')} />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...register('name')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NPK Last Used</Label>
                <Input type="date" {...register('npkLastUsed')} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="npk"
                  {...register('npk')}
                  className="h-4 w-4"
                />
                <Label htmlFor="npk">NPK</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="irrigation"
                  {...register('irrigation')}
                  className="h-4 w-4"
                />
                <Label htmlFor="irrigation">Irrigation</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waterConservation"
                  {...register('waterConservation')}
                  className="h-4 w-4"
                />
                <Label htmlFor="waterConservation">Water Conservation</Label>
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

// ──────────────────────────── STANDARD VALUES TAB ────────────────────────────

/** Standard value field names */
const STANDARD_VALUE_FIELDS = [
  'calciumMin',
  'calciumLow',
  'calciumIdeal',
  'calciumHigh',
  'calciumMax',
  'phMin',
  'phLow',
  'phIdeal',
  'phHigh',
  'phMax',
  'saltsMin',
  'saltsLow',
  'saltsIdeal',
  'saltsHigh',
  'saltsMax',
  'magnesiumMin',
  'magnesiumLow',
  'magnesiumIdeal',
  'magnesiumHigh',
  'magnesiumMax',
];

/** Standard values sub-tab component */
function StandardValuesTab({ initialData }: { initialData: any[] }) {
  const [values, setValues] = useState<any[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Record<string, number>>();

  const load = useCallback(async () => {
    setValues(await getStandardValues());
  }, []);

  const openEdit = (record: any) => {
    setEditing(record);
    const defaults: Record<string, number> = {};
    STANDARD_VALUE_FIELDS.forEach((f) => {
      defaults[f] = record[f] ?? 0;
    });
    reset(defaults);
    setDialogOpen(true);
  };

  const onSubmit = async (data: Record<string, number>) => {
    if (!editing) return;
    const numericData: Record<string, number> = {};
    for (const key of STANDARD_VALUE_FIELDS) {
      numericData[key] = Number(data[key]);
    }
    const result = await updateStandardValues(editing.id, numericData);
    result
      ? toast.success('Standard values updated.')
      : toast.error('Failed to update standard values.');
    setDialogOpen(false);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Farm ID</TableHead>
              <TableHead>Ca Ideal</TableHead>
              <TableHead>pH Ideal</TableHead>
              <TableHead>Salts Ideal</TableHead>
              <TableHead>Mg Ideal</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No standard values found.
                </TableCell>
              </TableRow>
            ) : (
              values.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.farmId}</TableCell>
                  <TableCell>{v.calciumIdeal}</TableCell>
                  <TableCell>{v.phIdeal}</TableCell>
                  <TableCell>{v.saltsIdeal}</TableCell>
                  <TableCell>{v.magnesiumIdeal}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(v)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Standard Values</DialogTitle>
            <DialogDescription>
              Update the standard mineral value thresholds for this farm.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {STANDARD_VALUE_FIELDS.map((field) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(field, { valueAsNumber: true })}
                  />
                </div>
              ))}
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
                {isSubmitting ? 'Saving...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ──────────────────────────── SUBSCRIPTIONS TAB (READ-ONLY) ────────────────────────────

/** Subscriptions sub-tab component (read-only) */
function SubscriptionsTab({ initialData }: { initialData: any[] }) {
  const [subs] = useState<any[]>(initialData);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Subscription data is read-only. Manage subscriptions via Stripe.
      </p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farm ID</TableHead>
              <TableHead>Stripe Sub ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Period End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              subs.map((s: any) => (
                <TableRow key={s.farmId}>
                  <TableCell>{s.farmId}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.stripeSubscriptionId ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === 'active'
                          ? 'success'
                          : s.status === 'past_due'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {s.status ?? 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.amount != null ? (s.amount / 100).toFixed(2) : '—'}
                  </TableCell>
                  <TableCell>{s.currency?.toUpperCase() ?? '—'}</TableCell>
                  <TableCell>{s.billingInterval ?? '—'}</TableCell>
                  <TableCell>
                    {s.currentPeriodEnd
                      ? new Date(s.currentPeriodEnd).toLocaleDateString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

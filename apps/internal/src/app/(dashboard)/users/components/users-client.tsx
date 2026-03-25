// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../actions';

/** Form data for user CRUD */
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  job: string;
  role: 'Admin' | 'Viewer';
  farmId: number;
  didOwnAndControlParcel: boolean;
  didManageAndControl: boolean;
}

/** Props for the users client component */
interface UsersClientProps {
  initialUsers: any[];
}

/**
 * Client component for users management.
 * Supports full CRUD operations for platform user accounts.
 */
export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  const load = useCallback(async (search?: string) => {
    setUsers(await getUsers(search));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      job: '',
      role: 'Viewer',
      farmId: 0,
      didOwnAndControlParcel: false,
      didManageAndControl: false,
    });
    setDialogOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    reset({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone ?? '',
      job: record.job ?? '',
      role: record.role,
      farmId: record.farmId ?? 0,
      didOwnAndControlParcel: record.didOwnAndControlParcel ?? false,
      didManageAndControl: record.didManageAndControl ?? false,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    const payload = {
      ...data,
      farmId: Number(data.farmId) || undefined,
      phone: data.phone || undefined,
      job: data.job || undefined,
    };
    if (editing) {
      const result = await updateUser(editing.id, payload);
      result
        ? toast.success('User updated.')
        : toast.error('Failed to update user.');
    } else {
      const result = await createUser(payload);
      result
        ? toast.success('User created.')
        : toast.error('Failed to create user.');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    (await deleteUser(id))
      ? toast.success('User deleted.')
      : toast.error('Failed to delete user.');
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage platform user accounts."
        onSearch={(query) => load(query || undefined)}
        searchPlaceholder="Search users..."
      />

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Farm ID</TableHead>
              <TableHead>Job</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell className="font-medium">
                    {u.firstName} {u.lastName}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === 'Admin' ? 'default' : 'secondary'}
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.farmId ?? '—'}</TableCell>
                  <TableCell>{u.job ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(u.id)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update user account details.'
                : 'Add a new platform user.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone (E164)</Label>
                <Input {...register('phone')} placeholder="+1234567890" />
              </div>
              <div className="space-y-2">
                <Label>Job</Label>
                <Input {...register('job')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  {...register('role')}
                >
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Farm ID</Label>
                <Input type="number" {...register('farmId')} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="didOwnAndControlParcel"
                  {...register('didOwnAndControlParcel')}
                  className="h-4 w-4"
                />
                <Label htmlFor="didOwnAndControlParcel" className="text-xs">
                  Owned & Controlled Parcel (3yr)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="didManageAndControl"
                  {...register('didManageAndControl')}
                  className="h-4 w-4"
                />
                <Label htmlFor="didManageAndControl" className="text-xs">
                  Managed & Controlled (3yr)
                </Label>
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

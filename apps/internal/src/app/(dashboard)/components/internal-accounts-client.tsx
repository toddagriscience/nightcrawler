// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
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
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  getInternalAccounts,
  createInternalAccount,
  updateInternalAccount,
  deleteInternalAccount,
} from '../actions';

/** Shape of an internal account record */
interface InternalAccountRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Form data for creating/updating an internal account */
interface AccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  isActive: boolean;
}

/** Props for the internal accounts client component */
interface InternalAccountsClientProps {
  initialAccounts: InternalAccountRecord[];
}

/**
 * Client component for internal accounts management (landing page).
 * Supports full CRUD operations for internal advisor/exec accounts.
 */
export default function InternalAccountsClient({
  initialAccounts,
}: InternalAccountsClientProps) {
  const [accounts, setAccounts] =
    useState<InternalAccountRecord[]>(initialAccounts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] =
    useState<InternalAccountRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>();

  const loadAccounts = useCallback(async (search?: string) => {
    const data = await getInternalAccounts(search);
    setAccounts(data as InternalAccountRecord[]);
  }, []);

  const openCreateDialog = () => {
    setEditingAccount(null);
    reset({
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (account: InternalAccountRecord) => {
    setEditingAccount(account);
    reset({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      title: account.title ?? '',
      isActive: account.isActive,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: AccountFormData) => {
    if (editingAccount) {
      const result = await updateInternalAccount(editingAccount.id, data);
      if (result) {
        toast.success('Account updated successfully.');
      } else {
        toast.error('Failed to update account.');
        return;
      }
    } else {
      const result = await createInternalAccount(data);
      if (result) {
        toast.success('Account created successfully.');
      } else {
        toast.error('Failed to create account.');
        return;
      }
    }
    setDialogOpen(false);
    loadAccounts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    const success = await deleteInternalAccount(id);
    if (success) {
      toast.success('Account deleted successfully.');
      loadAccounts();
    } else {
      toast.error('Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Accounts"
        description="Manage internal advisor and executive accounts."
        onSearch={(query) => loadAccounts(query || undefined)}
        searchPlaceholder="Search accounts..."
      />

      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No internal accounts found.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.firstName} {account.lastName}
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.title ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={account.isActive ? 'success' : 'secondary'}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(account)}
                        aria-label={`Edit ${account.firstName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(account.id)}
                        aria-label={`Delete ${account.firstName}`}
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
              {editingAccount ? 'Edit Account' : 'Create Account'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount
                ? 'Update the internal account details.'
                : 'Add a new internal advisor or executive account.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
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
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g. Senior Advisor"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
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
                {isSubmitting
                  ? 'Saving...'
                  : editingAccount
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

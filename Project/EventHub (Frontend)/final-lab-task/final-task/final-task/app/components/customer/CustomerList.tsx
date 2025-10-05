'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  CustomerUpdateInput,
  ProfileInput,
  profileSchema,
} from '@/app/lib/validators/customer';
import { zodResolver } from '@hookform/resolvers/zod';

type Customer = {
  id: number;
  name: string;
  email: string;
  profile?: {
    address: string;
    phone: string;
  };
};

export default function CustomerList() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<CustomerUpdateInput>();
  const {
    register: preg,
    handleSubmit: handleProfile,
    reset: resetProfile,
    formState: { isSubmitting: psub, errors: perr },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) });

  const fetchSelf = useCallback(async () => {
    try {
      const res = await api.get('/customer/me', { params: { t: Date.now() } });
      setCustomer(res.data);
      reset({ name: res.data.name, email: res.data.email });
    } 
    catch {
      setMsg('Failed to load customer');
      router.replace('/login'); // redirect if not authenticated
    }
  }, [reset, router]);

  useEffect(() => {
    fetchSelf();
  }, [fetchSelf]);


  //Patch
  const patchName = async () => {
    if (!customer) return;
    const newName = prompt('Enter new name:', customer.name);
    if (!newName) return;

    const oldCustomer = customer;
    setCustomer({ ...customer, name: newName });
    setMsg('Updating name...');

    try {
      await api.patch(`/customer/${customer.id}`, { name: newName });
      setMsg('Name updated');
      router.refresh();
    } 
    catch {
      setCustomer(oldCustomer);
      setMsg('Patch failed');
    }
  };


  //Put
  const updateAccount: SubmitHandler<CustomerUpdateInput> = async (data) => {
    if (!customer) return;

    const oldCustomer = customer;
    setCustomer({ ...customer, ...data });
    setMsg('Updating account...');

    try {
      await api.put(`/customer/${customer.id}`, data);
      setMsg('Account updated');
      router.refresh();
    } 
    catch {
      setCustomer(oldCustomer);
      setMsg('Update failed');
    }
  };

  //Post
  const createProfile: SubmitHandler<ProfileInput> = async (data) => {
    if (!customer) return;

    const oldCustomer = customer;
    setCustomer({ ...customer, profile: data });
    setMsg('Creating profile...');

    try {
      await api.post(`/customer/${customer.id}/profile`, data);
      setMsg('Profile created');
      resetProfile();
      router.refresh();
    } 
    catch (e: any) {
      setCustomer(oldCustomer);
      setMsg(e?.response?.data?.message || 'Profile creation failed');
    }
  };

  //Delete
  const deleteAccount = async () => {
    if (!customer) return;

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    setIsDeleted(true);
    setMsg('Account deleted');

    try {
      await api.delete(`/customer/${customer.id}`);
    } 
    catch {
      console.error('Delete API call failed');
    } 
    finally {
      router.replace('/login'); // redirect to login immediately
    }
  };

  if (isDeleted) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Account Deleted</h3>
        <p>Your account has been successfully deleted.</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-3 py-1 rounded bg-blue-600 text-white">
          Go to Login Page
        </button>
      </div>
    );
  }

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">My Account</h3>
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Profile:</strong> {customer.profile ? 'Yes' : 'No'}</p>

      <div className="flex gap-2 mt-2">
        <button onClick={patchName} className="px-3 py-1 rounded bg-blue-600 text-white">
          Patch Name
        </button>
        <a href={`/customer/${customer.id}`} className="px-3 py-1 rounded bg-gray-600 text-white">
          View Profile (SSR)
        </a>
        <button onClick={deleteAccount} className="px-3 py-1 rounded bg-red-600 text-white">
          Delete Account
        </button>
      </div>

      <h4 className="mt-4 font-medium">Update Account (PUT)</h4>
      <form onSubmit={handleSubmit(updateAccount)} className="space-y-2">
        <input {...register('name')} placeholder="Name" className="border px-2 py-1 w-full" />
        <input {...register('email')} placeholder="Email" className="border px-2 py-1 w-full" />
        <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white">
          Save
        </button>
      </form>

      {!customer.profile && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Create Profile (POST)</h4>
          <form onSubmit={handleProfile(createProfile)} className="space-y-2">
            <div>
              <input {...preg('address')} placeholder="Address" className="border px-2 py-1 w-full" />
              {perr.address && <p className="text-red-600 text-sm">{perr.address.message}</p>}
            </div>
            <div>
              <input {...preg('phone')} placeholder="Phone" className="border px-2 py-1 w-full" />
              {perr.phone && <p className="text-red-600 text-sm">{perr.phone.message}</p>}
            </div>
            <button type="submit" disabled={psub} className="px-3 py-1 rounded bg-purple-600 text-white">
              {psub ? 'Creating…' : 'Create Profile'}
            </button>
          </form>
        </div>
      )}

      {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>}
    </div>
  );
}

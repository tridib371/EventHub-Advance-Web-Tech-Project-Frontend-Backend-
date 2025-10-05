
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerCreateSchema, type CustomerCreateInput } from '@/app/lib/validators/customer';
import { api } from '@/app/lib/axios';

export default function CustomerForm({ onCreated }: { onCreated: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerCreateInput>({ resolver: zodResolver(customerCreateSchema) });

  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<CustomerCreateInput> = async (data) => {
    setMsg(null);
    try {
      await api.post('/customer/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setMsg('✅ Customer created');
      reset();
      onCreated?.();
    } 
    catch (e: any) {
      setMsg(e?.response?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow">
      <h2 className="font-semibold mb-3">Create Another Account (POST)</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <input {...register('name')} placeholder="Name" className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

        <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded">
          {isSubmitting ? 'Creating…' : 'Create Customer Account'}
        </button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}

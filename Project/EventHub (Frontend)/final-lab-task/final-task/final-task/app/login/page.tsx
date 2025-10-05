'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerLoginSchema, type CustomerLoginInput } from '@/app/lib/validators/customer';
import { api } from '@/app/lib/axios';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CustomerLoginInput>({ resolver: zodResolver(customerLoginSchema) });

  const [err, setErr] = useState<string | null>(null);

  const onSubmit: SubmitHandler<CustomerLoginInput> = async (data) => {
    setErr(null);
    try {
      await api.post('/customer/login', data);
      window.location.href = '/customer/dashboard';
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            {...register('email')}
            autoComplete="email"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            {...register('password')}
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account?{' '}
        <Link href="/register/customer" className="underline">
          Register as Customer
        </Link>
      </p>
      {err && <div className="text-red-600 mt-2">{err}</div>}
 </div>
);
}

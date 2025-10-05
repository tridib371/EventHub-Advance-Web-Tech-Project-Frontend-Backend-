
'use client';

import CustomerList from '@/app/components/customer/CustomerList';
import CustomerForm from '@/app/components/customer/CustomerForm';
import CustomerAuthGuard from '@/app/components/customer/CustomerAuthGuard';
import { api } from '@/app/lib/axios';
import { useCallback, useState } from 'react';

export default function CustomerDashboard() {
  const [msg, setMsg] = useState<string | null>(null);

  const logout = useCallback(async () => {
    try {
      await api.post('/customer/logout');
      window.location.href = '/login';
    } 
    catch {
      setMsg('Logout failed');
    }
  }, []);

  return (
    <CustomerAuthGuard>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Customer Dashboard</h2>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-800 text-white">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomerForm onCreated={() => { /* optional: could trigger a refresh here */ }} />
        <div className="md:col-span-2">
          <CustomerList />
        </div>
      </div>

      {msg && <div className="text-sm text-gray-600 mt-3">{msg}</div>}
    </CustomerAuthGuard>
);
}

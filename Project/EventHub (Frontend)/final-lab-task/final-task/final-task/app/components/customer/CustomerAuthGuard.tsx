
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/axios';

export default function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const redirecting = useRef(false);

  const checkAuth = async () => {
    try {

      await api.get('/customer/me', { params: { t: Date.now() } });
      setLoading(false);
    } 
    
    catch {
      if (!redirecting.current) {
        redirecting.current = true;
        router.replace('/login');
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.href);
    }

    // initial auth check
    checkAuth();

    // re-check when tab is focused, visible again, or restored from bfcache
    const onFocus = () => checkAuth();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkAuth();
    };
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) checkAuth();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 text-gray-600">
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
}

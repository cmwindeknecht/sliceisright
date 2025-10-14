'use client';

import { useAuth } from '@/components/Auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { jwtToken } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!jwtToken) {
      router.replace('/login');
    }
  }, [jwtToken, router]);
  
  return <>{children}</>;
}
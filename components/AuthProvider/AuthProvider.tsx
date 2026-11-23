'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession();
        if (!session.data.success) {
          clearIsAuthenticated();
          return;
        }
        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    void verifySession().finally(() => router.refresh());
  }, [clearIsAuthenticated, router, setUser]);

  return <>{children}</>;
}

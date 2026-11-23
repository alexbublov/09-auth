'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
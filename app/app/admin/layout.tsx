"use client";
import AdminMenu from '@/components/AdminMenu';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      // In a real application, you would verify the token with your backend here.
      // For this example, we'll just assume a token means authenticated.
      setIsAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


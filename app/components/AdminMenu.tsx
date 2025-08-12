'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AdminMenu = ({ isAuthenticated, onLogout }: AdminMenuProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/request', label: 'Requests' },
    { href: '/admin/promptpay', label: 'PromptPay Settings' },
    { href: '/admin/register', label: 'Register New Admin' },
    { href: '/admin/line-setting', label: 'Line Settings' },
  ];

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-lg font-bold">
          <Link href="/admin">Admin Panel</Link>
        </div>
        {isAuthenticated && (
          <nav className="hidden md:flex space-x-4 items-center">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className={`px-3 py-2 rounded hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-900' : ''}`}>
                {item.label}
              </Link>
            ))}
            <button
              onClick={onLogout}
              className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        )}
        <div className="md:hidden">
          {isAuthenticated ? (
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          ) : (
            <Link href="/admin/login" className="rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600">
              Login
            </Link>
          )}
        </div>
      </div>
      {isOpen && isAuthenticated && (
        <nav className="md:hidden">
          <ul className="flex flex-col p-4">
            {menuItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link href={item.href} className={`block p-2 rounded hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-900' : ''}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mb-2">
              <button
                onClick={onLogout}
                className="block w-full text-left p-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default AdminMenu;

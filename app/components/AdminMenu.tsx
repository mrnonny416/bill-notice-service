'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const AdminMenu = () => {
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
        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={`px-3 py-2 rounded hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-900' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden">
          <ul className="flex flex-col p-4">
            {menuItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link href={item.href} className={`block p-2 rounded hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-900' : ''}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default AdminMenu;

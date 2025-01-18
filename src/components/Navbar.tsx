'use client'

import { AppSession } from '@/types';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const { status, data } = useSession(); // Get session info
  const session = data as AppSession;
  const pathname = usePathname(); // Client-side hook to get pathname
  const [showNavbar, setShowNavbar] = useState(true);

  const role = session?.user?.role

  useEffect(() => {
    // Conditionally hide Navbar on /auth/
    setShowNavbar(!pathname.startsWith('/auth'));
  }, [pathname]);

  if (!showNavbar) return null; 
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <Link href="/" className="text-white text-3xl font-bold hover:text-yellow-400 transition-all">
          Job Board
        </Link>
        <div className="space-x-6 hidden md:flex">
          {role === 'user' &&
            <Link
              href="/dashboard"
              className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
            >
              Freelancer Dashboard
            </Link>
          }
          {role === 'employer' && 
          
            <Link
              href="/dashboard/employer"
              className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
            >
              Employer Dashboard
            </Link>
          }
          {status === 'authenticated' ? (
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-white py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/signin" className="text-white">
              Login
            </Link>
          )}
        </div>
        {/* Mobile menu */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="text-white text-lg">☰</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

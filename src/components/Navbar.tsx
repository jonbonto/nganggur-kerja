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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="space-x-6 hidden md:flex items-center">
          <Link
            href="/jobs"
            className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
          >
            Browse Jobs
          </Link>
          {role === 'user' && (
            <>
              <Link
                href="/dashboard/freelancer"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/job-seeker/profile"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                My Profile
              </Link>
            </>
          )}
          {role === 'employer' && (
            <>
              <Link
                href="/dashboard/employer"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs/post"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Post Job
              </Link>
              <Link
                href="/employer/profile"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Company Profile
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link
                href="/admin/dashboard"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Users
              </Link>
              <Link
                href="/admin/jobs"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Jobs
              </Link>
            </>
          )}
          {status === 'authenticated' ? (
            <>
              <Link
                href="/profile"
                className="text-white text-lg font-medium hover:text-yellow-400 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-white py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signup" className="text-white text-lg font-medium hover:text-yellow-400 transition-colors">
                Sign Up
              </Link>
              <Link href="/auth/signin" className="text-white py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 transition">
                Login
              </Link>
            </>
          )}
        </div>
        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-white text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-4 space-y-3">
          <Link
            href="/jobs"
            className="block text-white py-2 hover:text-yellow-400 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Jobs
          </Link>
          {role === 'user' && (
            <>
              <Link
                href="/dashboard/freelancer"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/job-seeker/profile"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            </>
          )}
          {role === 'employer' && (
            <>
              <Link
                href="/dashboard/employer"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/jobs/post"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Job
              </Link>
              <Link
                href="/employer/profile"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Company Profile
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link
                href="/admin/dashboard"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/admin/jobs"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
            </>
          )}
          {status === 'authenticated' ? (
            <>
              <Link
                href="/profile"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/auth/signin' });
                }}
                className="w-full text-left text-white py-2 hover:text-yellow-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/auth/signin"
                className="block text-white py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

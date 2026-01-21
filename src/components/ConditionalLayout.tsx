'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBetaRoute = pathname?.startsWith('/beta');

  if (isBetaRoute) {
    // For beta routes, don't show the original navbar/footer
    return <>{children}</>;
  }

  // For non-beta routes, show navbar and footer
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}

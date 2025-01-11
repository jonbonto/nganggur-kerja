import React from 'react';
import { Sidebar } from '@/components/Sidebar'; // Create Sidebar for Admin
import SessionWrapper from '@/components/SessionWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <div className="flex min-h-screen">
        <Sidebar /> {/* Sidebar with links to Users, Jobs, Applications */}
        <div className="flex-1 p-6">
          <main>{children}</main>
        </div>
      </div>
    </SessionWrapper>
  );
}

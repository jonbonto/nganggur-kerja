import React from 'react';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <ul>
        <li>
          <Link href="/admin/users" className="block py-2 hover:bg-gray-700 px-2">Manage Users</Link>
        </li>
        <li>
          <Link href="/admin/jobs" className="block py-2 hover:bg-gray-700 px-2">Manage Jobs</Link>
        </li>
        <li>
          <Link href="/admin/applications" className="block py-2 hover:bg-gray-700 px-2">Manage Applications</Link>
        </li>
      </ul>
    </div>
  );
};

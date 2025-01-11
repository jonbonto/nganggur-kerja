'use client'; // This makes it a client-side component

import { SessionProvider } from 'next-auth/react';

const SessionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;

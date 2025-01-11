// app/auth/layout.tsx
'use client'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      {children} {/* Render the sign-in form or other auth-related pages */}
    </div>
  );
};

export default AuthLayout;

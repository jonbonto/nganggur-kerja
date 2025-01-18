'use client'

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();


  const token = useSearchParams().get('token'); // Get the token from the URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
        setError("Passwords don't match. Please try again.");
        return;
      }
  
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => router.push('/signin'), 2000); // Redirect to login after success
      } else {
        setError(data.message || 'Failed to reset password');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Reset Your Password</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="password" className="block text-lg text-gray-700">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a new password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-lg text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your new password"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Remembered your password?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700">Sign In</a>
        </p>
      </div>
    </div>

  );
};

const ResetPasword = () => <Suspense fallback={<div>Loading search parameters...</div>}>
  <ResetPasswordPage />
</Suspense>
export default ResetPasword;

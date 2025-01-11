'use client'

import { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }

    try {
     // Call your API here to handle the reset password request
     const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Password reset link sent to your email!');
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Forgot Password?</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="email" className="block text-lg text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Send Reset Link
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

export default ForgotPassword;

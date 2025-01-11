// /api/auth/forgot-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
// import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

const forgotPasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate a reset token (using crypto for simplicity)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store the reset token in the database with an expiry (e.g., 1 hour)
  await prisma.passwordReset.create({
    data: {
      email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour expiry
    },
  });

  // Send reset link to user's email (you'll need to implement this function)
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  try {
    // await sendPasswordResetEmail(email, resetLink);
    console.log(resetLink, "sendEmail")
    res.status(200).json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset link' });
  }
};

export  { forgotPasswordHandler as POST };

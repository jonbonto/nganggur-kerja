// /api/auth/forgot-password.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

const forgotPasswordHandler = async (req: NextRequest) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  const { email } = await req.json();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
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
    NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    NextResponse.json({ message: 'Failed to send reset link' }, { status: 500 });
  }
};

export  { forgotPasswordHandler as POST };

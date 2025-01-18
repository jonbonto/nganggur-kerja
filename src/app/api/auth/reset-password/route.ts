// /api/auth/reset-password.ts

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const resetPasswordHandler = async (req: NextRequest) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Find the reset token in the database
  const resetRequest = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!resetRequest || resetRequest.expiresAt < new Date()) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password in the database
  await prisma.user.update({
    where: { email: resetRequest.email },
    data: { hashedPassword },
  });

  // Delete the token from the database (optional, security measure)
  await prisma.passwordReset.delete({
    where: { token },
  });

  NextResponse.json({ success: true });
};

export { resetPasswordHandler as POST };

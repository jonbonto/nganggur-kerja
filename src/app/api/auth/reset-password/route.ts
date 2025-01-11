// /api/auth/reset-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const resetPasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Find the reset token in the database
  const resetRequest = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!resetRequest || resetRequest.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired token' });
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

  res.status(200).json({ success: true });
};

export { resetPasswordHandler as POST };

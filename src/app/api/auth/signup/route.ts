// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Make sure Prisma client is properly configured

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the database
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      name,
      role,
    },
  });

  // Return the user data without password (do not send sensitive information)
  return NextResponse.json(user);
}

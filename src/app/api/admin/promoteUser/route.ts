import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust if necessary
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Only allow access if the user is an admin
  if (!token || token.role !== 'admin') {
    return NextResponse.json(
      { message: 'Access Denied' },
      { status: 403 } // Forbidden
    );
  }

  const { userId } = await req.json(); // User ID of the user to be promoted
  
  // Validate userId is provided
  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 } // Bad Request
    );
  }

  // Promote the user to admin in the database
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
    });

    return NextResponse.json({ message: `User ${user.email} is now an admin.` });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error promoting user to admin', error },
      { status: 500 } // Internal Server Error
    );
  }
}

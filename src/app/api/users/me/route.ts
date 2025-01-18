import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you are using the correct Prisma import
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { AppSession } from '@/types';

export async function GET() {
  try {
    // Retrieve the current session
    const session = await getServerSession(authOptions) as AppSession;

    // If no session, return an unauthorized response
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve user details from the database using session user ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If user not found, return a 404 response
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user's profile details
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch user profile' }, { status: 500 });
  }
}

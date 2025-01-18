import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Make sure to use the correct import for Prisma
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { AppSession } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as AppSession; // Get the user session

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the user is updating their own profile
    if (session.user.id !== parseInt((await params).id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Update user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}

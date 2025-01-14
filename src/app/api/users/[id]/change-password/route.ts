import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Correct import for Prisma
import bcrypt from 'bcryptjs'; // Custom auth helper to get user session
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions); // Get the user session

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the user is changing their own password
    if (session.user.id !== parseInt(params.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing current or new password' }, { status: 400 });
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !(bcrypt.compareSync(currentPassword, user.hashedPassword))) {
      return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
    }

    // Hash the new password and update the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to change password' }, { status: 500 });
  }
}

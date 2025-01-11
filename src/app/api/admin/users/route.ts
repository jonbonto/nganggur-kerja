import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function DELETE(request: Request) {
  const { userId } = await request.json();
  
  await prisma.user.delete({
    where: { id: userId }
  });

  return NextResponse.json({ message: 'User deleted successfully' });
}

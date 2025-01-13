import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const alerts = await prisma.jobAlert.findMany({
    where: { userId: token.id },
  });
  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { criteria } = await req.json();
  const newAlert = await prisma.jobAlert.create({
    data: {
      userId: token.id,
      criteria,
    },
  });
  return NextResponse.json(newAlert);
}

export async function DELETE(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  await prisma.jobAlert.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

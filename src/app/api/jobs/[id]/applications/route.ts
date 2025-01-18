import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import your Prisma client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { AppSession } from '@/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = parseInt(id);
  const job = await prisma.job.findFirst( { where: { id: jobId }})
  const session = await getServerSession(authOptions) as AppSession;
  if (!session || !session.user || session.user.role !== 'employer' || !job || job.postedById !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobId },
    include: { user: true }, // Include user data with the application
  });

  return NextResponse.json({ applications });
}

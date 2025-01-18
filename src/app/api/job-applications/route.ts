// src/app/api/job-applications/route.ts

import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { jobId, coverLetter, resumeUrl } = await request.json();
  
  const session = await getServerSession(authOptions) as AppSession;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobId,
      userId: session.user.id,
      coverLetter,
      resumeUrl,
      status: 'pending', // Default status
    },
  });

  return NextResponse.json(application);
}

export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    include: { job: true },
  });

  return NextResponse.json(applications);
}

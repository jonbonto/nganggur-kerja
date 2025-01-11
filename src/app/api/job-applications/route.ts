// src/app/api/job-applications/route.ts

import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { jobId, coverLetter, resumeUrl } = await request.json();
  
  const session = await getSession();
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

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    include: { job: true },
  });

  return NextResponse.json(applications);
}

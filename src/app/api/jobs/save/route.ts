import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    // Check if the job already exists in saved jobs for the user
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: token.id as number,
          jobId: jobId,
        },
      },
    });

    if (existingSavedJob) {
      return NextResponse.json({ message: 'Job already saved' }, { status: 200 });
    }

    // Save the job for the user
    await prisma.savedJob.create({
      data: {
        userId: token.id as number,
        jobId: jobId,
      },
    });

    return NextResponse.json({ message: 'Job saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save job', error: (error as Error).message }, { status: 500 });
  }
}

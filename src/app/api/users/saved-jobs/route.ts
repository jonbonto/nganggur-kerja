import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: token.id,
      },
      include: {
        job: true, // Include the job details
      },
    });

    return NextResponse.json({
      savedJobs: savedJobs.map((savedJob) => savedJob.job),
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch saved jobs', error: error.message }, { status: 500 });
  }
}

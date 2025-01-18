import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import your Prisma client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { AppSession } from '@/types';

export async function POST(req: NextRequest) {
    const { jobId, coverLetter, resumeUrl } = await req.json();
      
      const session = await getServerSession(authOptions) as AppSession;
      if (!session || !session.user || session.user.role !== 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Prevent duplicate application
      try {
        const where = {
          
            jobId: +jobId,
            userId: +session.user?.id,
          
        }
        const existingApplication = await prisma.jobApplication.findFirst({
          where
        });
      
        if (existingApplication) {
          return NextResponse.json({ message: 'You have already applied to this job.' }, { status: 400 });
        }
          
            const application = await prisma.jobApplication.create({
              data: {
                jobId: +jobId,
                userId: +session.user.id,
                coverLetter,
                resumeUrl,
                status: 'pending', // Default status
              },
            });
          
            return NextResponse.json(application);
      } catch (error) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message });
      } 
}

export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Fetch job applications for the authenticated user
  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    include: {
      job: true, // Include job details
    },
  });

  return NextResponse.json({ applications });
}
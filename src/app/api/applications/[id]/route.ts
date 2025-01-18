import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import your Prisma client
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get session data (user info) from the JWT or session
    const session = await getServerSession(authOptions) as Session & { user: { id: string } }; // Ensure this gives you the current logged-in user
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); // If no session or user ID, return Unauthorized
    }

    const { id: applicationId} = await params;
    const { status } = await req.json();

    // Check if status is valid
    if (status !== 'accepted' && status !== 'rejected') {
      return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
    }

    // Fetch the job application first to get the jobId
    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(applicationId) },
      select: { jobId: true },
    });

    // If the application is not found, return an error
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Fetch the job related to the application to check if the employer owns the job
    const job = await prisma.job.findUnique({
      where: { id: application.jobId },
      select: { postedById: true },
    });

    // If the job is not found or postedById does not match userId, return Unauthorized
    if (!job || job.postedById !== parseInt(session.user.id)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Proceed to update the job application status if ownership is confirmed
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: parseInt(applicationId) },
      data: { status },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json({ message: 'Error updating job application' }, { status: 500 });
  }
}

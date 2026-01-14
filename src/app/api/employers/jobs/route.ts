import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET all jobs posted by the employer
export async function GET(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active', 'archived', 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: { postedById: number; isActive?: boolean } = {
      postedById: session.user.id
    };

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'archived') {
      where.isActive = false;
    }

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          applications: {
            select: {
              id: true,
              status: true
            }
          },
          _count: {
            select: {
              applications: true,
              jobViews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    // Add statistics to each job
    const jobsWithStats = jobs.map(job => ({
      ...job,
      stats: {
        totalApplications: job._count.applications,
        pendingApplications: job.applications.filter(app => app.status === 'pending').length,
        acceptedApplications: job.applications.filter(app => app.status === 'accepted').length,
        rejectedApplications: job.applications.filter(app => app.status === 'rejected').length,
        totalViews: job._count.jobViews
      }
    }));

    return NextResponse.json({
      jobs: jobsWithStats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

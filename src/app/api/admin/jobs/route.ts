import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET all jobs for admin moderation
export async function GET(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'all', 'flagged', 'unapproved'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let where = {};
    
    if (filter === 'flagged') {
      where = { isFlagged: true };
    } else if (filter === 'unapproved') {
      where = { isApproved: false };
    }

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
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

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching jobs for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// PATCH update job status (approve/flag/unflag)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { jobId, action, flagReason } = body;

    if (!jobId || !action) {
      return NextResponse.json({ error: 'Job ID and action are required' }, { status: 400 });
    }

    let updateData = {};

    switch (action) {
      case 'approve':
        updateData = { isApproved: true, isFlagged: false, flagReason: null };
        break;
      case 'reject':
        updateData = { isApproved: false };
        break;
      case 'flag':
        updateData = { isFlagged: true, flagReason: flagReason || null };
        break;
      case 'unflag':
        updateData = { isFlagged: false, flagReason: null };
        break;
      case 'archive':
        updateData = { isActive: false };
        break;
      case 'activate':
        updateData = { isActive: true };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const job = await prisma.job.update({
      where: { id: parseInt(jobId) },
      data: updateData
    });

    return NextResponse.json({ job, message: `Job ${action}d successfully` });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE a job
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id: parseInt(jobId) }
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}

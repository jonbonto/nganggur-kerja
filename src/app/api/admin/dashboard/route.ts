import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET admin dashboard statistics
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current month start and end dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Parallel queries for better performance
    const [
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalAdmins,
      totalJobs,
      activeJobs,
      archivedJobs,
      flaggedJobs,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      newUsersThisMonth,
      newUsersLastMonth,
      newJobsThisMonth,
      newJobsLastMonth,
      recentUsers,
      recentJobs,
      jobsByCategory
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.user.count({ where: { role: 'employer' } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true, isApproved: true } }),
      prisma.job.count({ where: { isActive: false } }),
      prisma.job.count({ where: { isFlagged: true } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'pending' } }),
      prisma.jobApplication.count({ where: { status: 'accepted' } }),
      prisma.jobApplication.count({ where: { status: 'rejected' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.job.count({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.job.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          isActive: true
        }
      }),
      prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          postedBy: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      }),
      prisma.job.groupBy({
        by: ['category'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculate growth percentages
    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : newUsersThisMonth > 0 ? 100 : 0;

    const jobGrowth = newJobsLastMonth > 0
      ? ((newJobsThisMonth - newJobsLastMonth) / newJobsLastMonth) * 100
      : newJobsThisMonth > 0 ? 100 : 0;

    return NextResponse.json({
      overview: {
        users: {
          total: totalUsers,
          jobSeekers: totalJobSeekers,
          employers: totalEmployers,
          admins: totalAdmins,
          newThisMonth: newUsersThisMonth,
          growth: userGrowth
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          archived: archivedJobs,
          flagged: flaggedJobs,
          newThisMonth: newJobsThisMonth,
          growth: jobGrowth
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications
        }
      },
      recent: {
        users: recentUsers,
        jobs: recentJobs
      },
      analytics: {
        jobsByCategory: jobsByCategory.map(item => ({
          category: item.category,
          count: item._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

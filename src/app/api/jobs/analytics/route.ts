import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Aggregate data for the employer's jobs
    const analytics = await prisma.job.findMany({
      where: { postedById: token.id },
      select: {
        title: true,
        jobViews: {
          select: {
            location: true,
            device: true,
          },
        },
      },
    });

    // Transform data for visualization
    const aggregatedData = analytics.map((job) => {
      const deviceCounts: Record<string, number> = {};
      const locationCounts: Record<string, number> = {};

      job.jobViews.forEach((view) => {
        // Count devices
        if (view.device) {
          deviceCounts[view.device] = (deviceCounts[view.device] || 0) + 1;
        }
        // Count locations
        if (view.location) {
          locationCounts[view.location] = (locationCounts[view.location] || 0) + 1;
        }
      });

      return {
        jobTitle: job.title,
        devices: Object.entries(deviceCounts).map(([type, count]) => ({
          type,
          count,
        })),
        locations: Object.entries(locationCounts).map(([place, count]) => ({
          place,
          count,
        })),
      };
    });

    return NextResponse.json({ data: aggregatedData });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

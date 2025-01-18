import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { UAParser } from 'ua-parser-js';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { id } = await params;
  const jobId = parseInt(id);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isNaN(jobId)) {
    return NextResponse.json({ error: 'Invalid Job ID' }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { postedById: true },
  });

  if (job?.postedById === token.id) {
    return NextResponse.json({ success: true }); // No increment for job poster
  }

  try {
    const userAgent = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || '';

    // Parse device type
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().type || 'desktop'; // Defaults to 'desktop' if no type is detected

    // Geolocation (Optional, requires an external API)
    let location = 'Unknown';
    if (ipAddress) {
      // Example: Use a free API like ip-api.com
      const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const geoData = await response.json();
      if (geoData.status === 'success') {
        location = `${geoData.city}, ${geoData.country}`;
      }
    }

    // Check if the user has already viewed the job
    const existingView = await prisma.jobView.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: token.id as number,
        },
      },
    });

    if (!existingView) {
      // Add a new view if it doesn't exist
      await prisma.jobView.create({
        data: {
          jobId,
          userId: token.id as number,
          location,
          device,
          referrer,
        },
      });

      // Optionally increment the job's total view count
      await prisma.job.update({
        where: { id: jobId },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track job view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}

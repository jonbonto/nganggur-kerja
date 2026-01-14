import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET job seeker profile with skills, experience, education
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        skills: true,
        experiences: {
          orderBy: { startDate: 'desc' }
        },
        educations: {
          orderBy: { startDate: 'desc' }
        },
        applications: {
          include: {
            job: true
          },
          orderBy: { appliedAt: 'desc' },
          take: 10
        },
        savedJobs: {
          include: {
            job: true
          },
          orderBy: { savedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { hashedPassword, ...profileData } = profile;

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error('Error fetching job seeker profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT update job seeker profile
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, bio, location, resumeUrl, profilePicture } = body;

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        bio,
        location,
        resumeUrl,
        profilePicture
      }
    });

    const { hashedPassword, ...profileData } = updatedProfile;

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

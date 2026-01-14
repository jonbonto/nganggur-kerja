import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET employer/company profile
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json({ error: 'Failed to fetch company profile' }, { status: 500 });
  }
}

// POST create company profile
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, logo, website, industry, size, description, founded } = body;

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Company profile already exists' }, { status: 400 });
    }

    const profile = await prisma.companyProfile.create({
      data: {
        userId: session.user.id,
        companyName,
        logo,
        website,
        industry,
        size,
        description,
        founded: founded ? parseInt(founded) : null
      }
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error('Error creating company profile:', error);
    return NextResponse.json({ error: 'Failed to create company profile' }, { status: 500 });
  }
}

// PUT update company profile
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id || session.user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, logo, website, industry, size, description, founded } = body;

    const profile = await prisma.companyProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName,
        logo,
        website,
        industry,
        size,
        description,
        founded: founded ? parseInt(founded) : null
      },
      update: {
        companyName,
        logo,
        website,
        industry,
        size,
        description,
        founded: founded ? parseInt(founded) : null
      }
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json({ error: 'Failed to update company profile' }, { status: 500 });
  }
}

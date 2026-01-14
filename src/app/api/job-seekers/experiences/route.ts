import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET all experiences for the user
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const experiences = await prisma.experience.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

// POST add a new experience
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { company, position, description, startDate, endDate, isCurrent } = body;

    if (!company || !position || !startDate) {
      return NextResponse.json({ error: 'Company, position and start date are required' }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        userId: session.user.id
      }
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

// PUT update an experience
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, company, position, description, startDate, endDate, isCurrent } = body;

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    });

    if (!existingExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    const experience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: {
        company,
        position,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent !== undefined ? isCurrent : undefined
      }
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

// DELETE an experience
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('id');

    if (!experienceId) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }

    // Verify ownership
    const experience = await prisma.experience.findFirst({
      where: {
        id: parseInt(experienceId),
        userId: session.user.id
      }
    });

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    await prisma.experience.delete({
      where: { id: parseInt(experienceId) }
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET all educations for the user
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const educations = await prisma.education.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json({ educations });
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json({ error: 'Failed to fetch educations' }, { status: 500 });
  }
}

// POST add a new education
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { institution, degree, fieldOfStudy, startDate, endDate, isCurrent } = body;

    if (!institution || !degree || !startDate) {
      return NextResponse.json({ error: 'Institution, degree and start date are required' }, { status: 400 });
    }

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        userId: session.user.id
      }
    });

    return NextResponse.json({ education }, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

// PUT update an education
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, institution, degree, fieldOfStudy, startDate, endDate, isCurrent } = body;

    if (!id) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    });

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    const education = await prisma.education.update({
      where: { id: parseInt(id) },
      data: {
        institution,
        degree,
        fieldOfStudy,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent !== undefined ? isCurrent : undefined
      }
    });

    return NextResponse.json({ education });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

// DELETE an education
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const educationId = searchParams.get('id');

    if (!educationId) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    }

    // Verify ownership
    const education = await prisma.education.findFirst({
      where: {
        id: parseInt(educationId),
        userId: session.user.id
      }
    });

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    await prisma.education.delete({
      where: { id: parseInt(educationId) }
    });

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}

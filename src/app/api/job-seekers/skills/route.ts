import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { AppSession } from '@/types';

// GET all skills for the user
export async function GET() {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const skills = await prisma.skill.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST add a new skill
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, level } = body;

    if (!name) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level,
        userId: session.user.id
      }
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

// DELETE a skill
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as AppSession;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('id');

    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    // Verify ownership
    const skill = await prisma.skill.findFirst({
      where: {
        id: parseInt(skillId),
        userId: session.user.id
      }
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await prisma.skill.delete({
      where: { id: parseInt(skillId) }
    });

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}

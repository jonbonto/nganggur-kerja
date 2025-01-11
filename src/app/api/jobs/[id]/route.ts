import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching job details', error: error.message },
      { status: 500 }
    );
  }
}

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { AppSession } from '@/types';

// Function to paginate data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paginate = (array: unknown[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return array.slice(start, end);
};

export async function GET(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { role } = token;
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const location = searchParams.get('location');
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(location && { location }),
    };
    
    if (role === 'employer') {
      where.postedById = +(token.id as number); // Filter jobs created by the logged-in employer
    }
    try {
      const jobs = await prisma.job.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      });
      
    
      
      const totalJobs = await prisma.job.count({ where });
      const totalPages = Math.ceil(totalJobs / Number(limit));
    
      return NextResponse.json({ jobs, totalPages }, { status: 200 });
    } catch (error) {
      console.log((error as Error).message);
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions) as AppSession;
    
    if (!session || session.user?.role !== 'employer') {
      return NextResponse.json(
        { message: 'Unauthorized. Only employers can post jobs.' },
        { status: 403 }
      );
    }
  
    const { title, company, category, description, salary, location } = await req.json();
    
    if (!title || !company || !category || !description || !salary || !location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
  
    try {
      const job = await prisma.job.create({
        data: {
          title,
          company,
          category,
          description,
          salary,
          location,
          postedById: session.user.id, // assuming the session contains the user's ID
        },
      });
  
      return NextResponse.json(job, { status: 201 });
    } catch {
      return NextResponse.json({ message: 'Error posting job' }, { status: 500 });
    }
  }

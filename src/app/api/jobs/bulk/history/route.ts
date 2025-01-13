import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const creatorId = token.id

  if (!creatorId) {
    return NextResponse.json({ message: "Employer ID is required" }, { status: 400 });
  }

  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') || 1); // Default page is 1
  const limit = Number(url.searchParams.get('limit') || 5); // Default limit is 5

  try {
    const totalRecords = await prisma.uploadHistory.count({
      where: { creatorId: Number(creatorId) },
    });
    const totalPages = Math.ceil(totalRecords / limit);
    const skip = (page - 1) * limit;

    // Get the paginated records
    const history = await prisma.uploadHistory.findMany({
      where: { creatorId: Number(creatorId) },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Sort by the most recent uploads
      },
    });

    return NextResponse.json({
      history,
      totalPages,
      currentPage: page,
      totalRecords,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

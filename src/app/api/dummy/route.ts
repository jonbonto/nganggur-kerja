import { prisma } from '@/lib/prisma';  // Import your Prisma client
import bcrypt from 'bcryptjs';

async function insertDummyUser() {
  const hashedPassword = await bcrypt.hash('dummy', 10); // Hash the dummy password

  try {
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        hashedPassword,
      },
    });

    console.log('Dummy user created:', user);
  } catch (error) {
    console.error('Error inserting dummy user:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}

export async function GET() {
    insertDummyUser()
}
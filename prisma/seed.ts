import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  // Seed admin user
  const adminPassword = await bcrypt.hash('admin', 10);
  const employerPassword1 = await bcrypt.hash('employer', 10);
  const employerPassword2 = await bcrypt.hash('employer', 10);
  const userPassword1 = await bcrypt.hash('user', 10);
  const userPassword2 = await bcrypt.hash('user', 10);
  const userPassword3 = await bcrypt.hash('user', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin User',
      hashedPassword: adminPassword,
    },
  });

  await prisma.user.create({
    data: {
      email: 'employer1@example.com',
      role: 'employer',
      name: 'Employer One',
      hashedPassword: employerPassword1,
    },
  });

  await prisma.user.create({
    data: {
      email: 'employer2@example.com',
      role: 'employer',
      name: 'Employer Two',
      hashedPassword: employerPassword2,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user1@example.com',
      role: 'user',
      name: 'User One',
      hashedPassword: userPassword1,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user2@example.com',
      role: 'user',
      name: 'User Two',
      hashedPassword: userPassword2,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user3@example.com',
      role: 'user',
      name: 'User Three',
      hashedPassword: userPassword3,
    },
  });
}

async function seedJobs() {
    // Creating jobs for user with postedById = 2 (Employer 2)
   const job1 = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      company: 'Tech Corp',
      category: 'Development',
      description: 'We are looking for a full-stack developer to join our team.',
      salary: '$100,000',
      location: 'New York, NY',
      requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      benefits: ['Health Insurance', 'Stock Options'],
      postedById: 2,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'UI/UX Designer',
      company: 'Creative Solutions',
      category: 'Design',
      description: 'Join our creative team as a UI/UX Designer.',
      salary: '$80,000',
      location: 'San Francisco, CA',
      requirements: ['Figma', 'Photoshop', 'Design Thinking'],
      benefits: ['Health Insurance', 'Paid Time Off'],
      postedById: 2,
    },
  });

  // Creating jobs for user with postedById = 3 (Employer 3)
  const job3 = await prisma.job.create({
    data: {
      title: 'Marketing Specialist',
      company: 'MarketX',
      category: 'Marketing',
      description: 'We are looking for a marketing specialist to join our growing team.',
      salary: '$60,000',
      location: 'Remote',
      requirements: ['SEO', 'Content Creation', 'Google Analytics'],
      benefits: ['Health Insurance', 'Remote Work'],
      postedById: 3,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'Sales Manager',
      company: 'SalesForce',
      category: 'Sales',
      description: 'We are seeking a Sales Manager to lead our sales team.',
      salary: '$110,000',
      location: 'Chicago, IL',
      requirements: ['Sales Experience', 'Leadership'],
      benefits: ['Health Insurance', '401(k)'],
      postedById: 3,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'Customer Support Specialist',
      company: 'SupportNow',
      category: 'Support',
      description: 'Looking for customer support specialists to assist our users.',
      salary: '$40,000',
      location: 'Remote',
      requirements: ['Customer Service', 'Problem Solving'],
      benefits: ['Health Insurance', 'Paid Time Off'],
      postedById: 3,
    },
  });

  console.log('Jobs seeded:', { job1, job2, job3, job4, job5 });
}

async function seedApplications() {
  for (let jobId = 1; jobId <= 5; jobId++) {
    for (let userId = 4; userId <= 6; userId++) {
      const coverLetter = `Cover letter for Job ${jobId} by User ${userId}`;
      const resumeUrl = `https://example.com/resume_${userId}_${jobId}.pdf`;
      const status = ["pending", "accepted", "rejected"][Math.floor(Math.random() * 3)];

      await prisma.jobApplication.create({
        data: {
          userId: userId,
          jobId: jobId,
          coverLetter: coverLetter,
          resumeUrl: resumeUrl,
          status: status,
        },
      });
    }
  }

  console.log("Seed applications inserted successfully!");
}

async function main() {
  // await seedUsers();

  // await seedJobs();

  await seedApplications();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

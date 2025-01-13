import cron from 'node-cron';
import { prisma } from './prisma'; // Import Prisma client
import nodemailer from 'nodemailer';

// Create a cron job that runs daily at midnight
cron.schedule('0 0 * * *', async () => {
  const alerts = await prisma.jobAlert.findMany({
    include: { user: true }, // Include user data to send emails
  });

  alerts.forEach(async (alert) => {
    const matchingJobs = await prisma.job.findMany({
      where: {
        AND: [
          { category: alert.criteria.category },
          { location: alert.criteria.location },
        ],
      },
    });

    if (matchingJobs.length > 0) {
      // Send email to user
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const message = {
        from: process.env.EMAIL_USER,
        to: alert.user.email,
        subject: 'Job Alerts - New Jobs Available!',
        text: `We have new jobs that match your alert criteria: \n\n` +
              matchingJobs.map(job => `${job.title} at ${job.company}`).join('\n'),
      };

      await transporter.sendMail(message);
    }
  });
});

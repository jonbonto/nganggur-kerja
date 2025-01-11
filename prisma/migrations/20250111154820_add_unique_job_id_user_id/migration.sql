/*
  Warnings:

  - A unique constraint covering the columns `[jobId,userId]` on the table `job_applications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "requirements" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_jobId_userId_key" ON "job_applications"("jobId", "userId");

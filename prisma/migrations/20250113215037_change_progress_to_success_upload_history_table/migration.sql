/*
  Warnings:

  - You are about to drop the column `progress` on the `upload_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "upload_history" DROP COLUMN "progress",
ADD COLUMN     "success" INTEGER NOT NULL DEFAULT 0;

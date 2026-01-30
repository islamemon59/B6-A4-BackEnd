/*
  Warnings:

  - You are about to drop the column `meetingLink` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `notesFromStudent` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `notesFromTutor` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `hourlyRate` to the `tutor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "meetingLink",
DROP COLUMN "notesFromStudent",
DROP COLUMN "notesFromTutor";

-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BDT',
ADD COLUMN     "hourlyRate" DOUBLE PRECISION NOT NULL;

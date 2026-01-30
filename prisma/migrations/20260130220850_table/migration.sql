/*
  Warnings:

  - You are about to drop the column `timezone` on the `availability_slots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "availability_slots" DROP COLUMN "timezone";

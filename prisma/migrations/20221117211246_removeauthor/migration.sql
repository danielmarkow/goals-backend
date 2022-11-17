/*
  Warnings:

  - You are about to drop the column `authorId` on the `Goal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_authorId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "authorId";

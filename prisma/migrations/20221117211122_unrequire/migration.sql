-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_authorId_fkey";

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

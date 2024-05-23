/*
  Warnings:

  - You are about to drop the column `penalized_at` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "penalized_at",
ADD COLUMN     "penalizedAt" DATE;

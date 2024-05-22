/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `book_loans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book_loans" DROP COLUMN "deleted_at",
ALTER COLUMN "loan_date" SET DEFAULT CURRENT_TIMESTAMP;

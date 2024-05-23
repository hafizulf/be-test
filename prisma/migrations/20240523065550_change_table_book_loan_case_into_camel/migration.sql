/*
  Warnings:

  - You are about to drop the column `loan_date` on the `book_loans` table. All the data in the column will be lost.
  - You are about to drop the column `return_date` on the `book_loans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book_loans" DROP COLUMN "loan_date",
DROP COLUMN "return_date",
ADD COLUMN     "loanDate" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "returnDate" DATE;

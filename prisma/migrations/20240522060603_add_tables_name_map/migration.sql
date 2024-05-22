/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "books" (
    "code" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "stock" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "members" (
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "books_code_key" ON "books"("code");

-- CreateIndex
CREATE UNIQUE INDEX "members_code_key" ON "members"("code");

-- CreateTable
CREATE TABLE "book_loans" (
    "id" SERIAL NOT NULL,
    "bookCode" VARCHAR(100) NOT NULL,
    "memberCode" VARCHAR(100) NOT NULL,

    CONSTRAINT "book_loans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_loans" ADD CONSTRAINT "book_loans_bookCode_fkey" FOREIGN KEY ("bookCode") REFERENCES "books"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_loans" ADD CONSTRAINT "book_loans_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

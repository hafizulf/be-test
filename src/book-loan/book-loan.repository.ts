import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { BookLoanEntity } from "./book-loan.entity";

@Injectable()
export class BookLoanRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async getBorrowedBooks(memberCode: string): Promise<BookLoanEntity[]> {
    const borrowedBooks = await this.prismaService.bookLoan.findMany({
      where: {
        memberCode
      }
    });
    return borrowedBooks.map(bookLoan => BookLoanEntity.create(bookLoan));
  }

  async bookingBooks(
    memberCode: string,
    bookCodes: string[],
  ): Promise<BookLoanEntity[]> {
    const isBorrowed = await this.prismaService.bookLoan.findMany({
      where: {
        memberCode,
        return_date: null, // book is not returned yet
      }
    })

    if(isBorrowed.length + bookCodes.length > 2) {
      throw new BadRequestException('Member cannot borrow more than two books');
    }

    const borrowedBooks = await this.prismaService.bookLoan.createManyAndReturn({
      data: bookCodes.map(bookCode => ({
        bookCode,
        memberCode
      }))
    });

    return borrowedBooks.map(bookLoan => BookLoanEntity.create(bookLoan));
  }
}

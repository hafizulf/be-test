import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
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
    const isBorrowedByOther = await this.prismaService.bookLoan.findMany({
      where: {
        returnDate: null,
        bookCode: {
          in: bookCodes
        }
      }
    });

    if(isBorrowedByOther.length > 0) {
      throw new BadRequestException(
        'Book is already borrowed by other member'
      );
    }

    const totalBorrowedBy = isBorrowedByOther.filter((book) => {
      if(memberCode === book.memberCode && book.returnDate === null) {
        return book
      }
    })

    if(totalBorrowedBy.length + bookCodes.length > 2) {
      throw new BadRequestException(
        'Member cannot borrow more than two books'
      );
    }

    const borrowedBooks = await this.prismaService.bookLoan.createManyAndReturn({
      data: bookCodes.map(bookCode => ({
        bookCode,
        memberCode,
      }))
    });

    return borrowedBooks.map(bookLoan => BookLoanEntity.create(bookLoan));
  }

  async findByIdsAndMemberCode(
    memberCode: string,
    ids: number[],
  ): Promise<BookLoanEntity[]> {
    const borrowedBooks = await this.prismaService.bookLoan.findMany({
      where: {
        memberCode,
        id: {
          in: ids
        },
        returnDate: null, // book is not returned yet
      }
    });

    if (borrowedBooks.length === 0) {
      throw new NotFoundException(
        'Book loaned not found'
      );
    }

    return borrowedBooks.map(bookLoan => BookLoanEntity.create(bookLoan));
  }

  async returnBook(id: number): Promise<BookLoanEntity> {
    const bookLoan = await this.prismaService.bookLoan.update({
      where: {
        id,
        returnDate: null, // book is not returned yet
      },
      data: {
        returnDate: new Date()
      }
    })

    if (!bookLoan) {
      throw new NotFoundException(
        'Book loaned not found'
      );
    }

    return BookLoanEntity.create(bookLoan);
  }
}

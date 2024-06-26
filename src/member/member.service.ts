import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { BookLoanRepository } from '../book-loan/book-loan.repository';
import { IBookLoan } from '../book-loan/book-loan.entity';
import { CreateBorrowBookResponse, TotalBorrowedBookMemberResponse, UpdateBorrowBookResponse } from './member.model';
import { ValidationService } from '../common/validation.service';
import { MemberValidation } from './member.validation';
import { BookRepository } from '../book/book.repository';
import { PrismaService } from '../common/prisma.service';
import * as moment from 'moment';

@Injectable()
export class MemberService {
  constructor(
    private repository: MemberRepository,
    private validationService: ValidationService,
    private bookLoanRepository: BookLoanRepository,
    private bookRepository: BookRepository,
    private prismaService: PrismaService,
  ) {}

  async getMemberBorrowBooks():
    Promise<TotalBorrowedBookMemberResponse[]> {
      const members = await this.repository.findMembersWithTotalBorrowedBooks();

      return members.map(member => {
        return {
          code: member.code,
          name: member.name,
          totalBorrowedBooks: member.bookLoans.length
        }
      });
  }

  async borrowBook(
    memberCode: string,
    bookCodes: string[],
  ): Promise<CreateBorrowBookResponse> {
    const borrowBookSchema = this.validationService.validate(
      MemberValidation.borrowBookSchema,
      {
        memberCode,
        bookCodes,
      },
    );

    return await this.prismaService.$transaction(async () => { // db transaction
      await this.repository.findMemberNotPenalizeByCode(borrowBookSchema.memberCode);
      await Promise.all(
        bookCodes.map(async (bookCode) => {
          await this.bookRepository.findBookByCode(bookCode);
        })
      );
      await this.bookLoanRepository.bookingBooks(memberCode, bookCodes);
      await this.bookRepository.decrementStock(bookCodes);

      return {
        memberCode,
        bookCodes,
      };
    });
  }

  async returnBook(
    memberCode: string,
    bookIds: number[],
  ): Promise<UpdateBorrowBookResponse> {
    const returnBookSchema = this.validationService.validate(
      MemberValidation.returnBorrowBookSchema,
      {
        memberCode,
        bookIds,
      },
    );

    const bookLoans = await this.bookLoanRepository.findByIdsAndMemberCode(
      returnBookSchema.memberCode,
      returnBookSchema.bookIds
    );

    const returnedBooks: IBookLoan[] = [];
    for (const bookLoan of bookLoans) {
      const today = moment();
      const loanDatePlusSevenDays = moment(bookLoan.loanDate).add(7, 'days');

      if(today.isAfter(loanDatePlusSevenDays)) {
        await this.repository.penalizeMember(bookLoan.memberCode);
      }

      const returnedBook = await this.bookLoanRepository.returnBook(bookLoan.id);
      await this.bookRepository.incrementStock([bookLoan.bookCode]);

      returnedBooks.push(returnedBook);
    }

    return {
      memberCode,
      bookCodes: returnedBooks.map(book => book.bookCode),
    }
  }
}

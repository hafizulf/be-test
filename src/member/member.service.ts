import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMember } from './member.entity';
import { BookLoanRepository } from 'src/book-loan/book-loan.repository';
import { IBookLoan } from 'src/book-loan/book-loan.entity';
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

  async get():
    Promise<IMember[]> {
      return (
        (await this.repository.get())
          .map(member => member.unmarshal())
      );
    }

  async getTotalBorrowed(memberCode: string):
    Promise<TotalBorrowedBookMemberResponse> {
      const getTotalBorrowedSchema = this.validationService.validate(
        MemberValidation.getTotalBorrowedSchema,
        {
          memberCode
        },
      );

      const member = await this.repository.findMemberByCode(getTotalBorrowedSchema.memberCode);
      const borrowedBooks: IBookLoan[] = await this.bookLoanRepository.getBorrowedBooks(member.code);

      if(borrowedBooks.length === 0) {
        return {
          code: member.code,
          name: member.name,
          totalBorrowedBooks: 0
        }
      }

      return {
        code: member.code,
        name: member.name,
        totalBorrowedBooks: borrowedBooks.length
      }
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
      const loanDatePlusSevenDays = moment(bookLoan.loan_date).add(7, 'days');

      if(today.isAfter(loanDatePlusSevenDays)) {
        await this.repository.penalizeMember(bookLoan.memberCode);
      }

      await this.bookRepository.incrementStock([bookLoan.bookCode]);
      const returnedBook = await this.bookLoanRepository.returnBook(bookLoan.id);

      returnedBooks.push(returnedBook);
    }

    return {
      memberCode,
      bookCodes: returnedBooks.map(book => book.bookCode),
    }
  }
}

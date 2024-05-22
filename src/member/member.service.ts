import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMember } from './member.entity';
import { BookLoanRepository } from 'src/book-loan/book-loan.repository';
import { IBookLoan } from 'src/book-loan/book-loan.entity';
import { CreateBorrowBookResponse, TotalBorrowedBookMemberResponse } from './member.model';
import { ValidationService } from '../common/validation.service';
import { MemberValidation } from './member.validation';
import { BookRepository } from '../book/book.repository';
import { PrismaService } from '../common/prisma.service';

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
      await this.bookRepository.updateStock(bookCodes);

      return {
        memberCode,
        bookCodes,
      };
    });
  }
}

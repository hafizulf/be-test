import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMember } from './member.entity';
import { BookLoanRepository } from 'src/book-loan/book-loan.repository';
import { IBookLoan } from 'src/book-loan/book-loan.entity';
import { TotalBorrowedBookMemberResponse } from './member.model';
import { ValidationService } from '../common/validation.service';
import { MemberValidation } from './member.validation';

@Injectable()
export class MemberService {
  constructor(
    private repository: MemberRepository,
    private validationService: ValidationService,
    private bookLoanRepository: BookLoanRepository,
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
}

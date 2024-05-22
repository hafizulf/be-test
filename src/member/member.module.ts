import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { BookLoanModule } from '../book-loan/book-loan.module';
import { BookLoanRepository } from '../book-loan/book-loan.repository';

@Module({
  imports: [BookLoanModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, BookLoanRepository],
})
export class MemberModule {}

import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { BookLoanModule } from './book-loan/book-loan.module';

@Module({
  imports: [CommonModule, BookModule, MemberModule, BookLoanModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

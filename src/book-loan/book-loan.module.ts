import { Module } from '@nestjs/common';
import { BookRepository } from 'src/book/book.repository';

@Module({
  providers: [BookRepository],
  exports: [BookRepository],
})
export class BookLoanModule {}

import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [CommonModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

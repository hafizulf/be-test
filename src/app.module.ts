import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [CommonModule, BookModule, MemberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

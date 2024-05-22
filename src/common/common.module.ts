import { Global, Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { ValidationService } from './validation.service';

@Global()
@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}

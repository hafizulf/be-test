import { Global, Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
  ],
  exports: [PrismaService],
})
export class CommonModule {}

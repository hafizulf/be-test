import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor() {
    super();
  }

  async onModuleInit() {
    const bookSeederPath = path.join(process.cwd(), 'resources/books.json');
    const memberSeederPath = path.join(process.cwd(), 'resources/member.json');

    if (fs.existsSync(bookSeederPath)) {
      const books = JSON.parse(fs.readFileSync(bookSeederPath, 'utf8'));

      for (const book of books) {
        const existingBook = await this.book.findUnique({
          where: { code: book.code },
        });

        if (!existingBook) {
          try {
            await this.book.create({ data: book });
            console.log(`Book ${book.id} seeded successfully`);
          } catch (error) {
            console.error(`Error seeding book ${book.id}:`, error);
          }
        }
      }
    }

    if (fs.existsSync(memberSeederPath)) {
      const members = JSON.parse(fs.readFileSync(memberSeederPath, 'utf8'));

      for (const member of members) {
        const existingMember = await this.member.findUnique({
          where: { code: member.code },
        });

        if (!existingMember) {
          try {
            await this.member.create({ data: member });
            console.log(`member ${member.id} seeded successfully`);
          } catch (error) {
            console.error(`Error seeding member ${member.id}:`, error);
          }
        }
      }
    }
  }
}

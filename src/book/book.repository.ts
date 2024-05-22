import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { BookEntity } from "./book.entity";

@Injectable()
export class BookRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async getListAvailable(): Promise<BookEntity[]> {
    const books = await this.prismaService.book.findMany({
      where: {
        stock: {
          gt: 0
        }
      },
      orderBy: {
        title: 'asc'
      }
    })

    return books.map(book => BookEntity.create(book));
  }

  async getListBooked(): Promise<BookEntity[]> {
    const books = await this.prismaService.book.findMany({
      where: {
        stock: {
          lt: 1
        }
      },
      orderBy: {
        title: 'asc'
      }
    })

    return books.map(book => BookEntity.create(book));
  }

  async findBookByCode(bookCode: string): Promise<BookEntity> {
    const book = await this.prismaService.book.findUnique({
      where: {
        code: bookCode,
        stock: {
          gt: 0
        }
      }
    })

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return BookEntity.create(book);
  }
}

import { Injectable } from "@nestjs/common";
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
}

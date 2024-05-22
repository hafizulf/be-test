import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { IBook, BookEntity } from "./book.entity";

@Injectable()
export class BookRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async getListAvailable(): Promise<IBook[]> {
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
}

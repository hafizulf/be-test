import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class BookLoanRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async getBorrowedBooks(memberCode: string): Promise<any> {
    const borrowedBooks = await this.prismaService.bookLoan.findMany({
      where: {
        memberCode
      }
    });
    return borrowedBooks;
  }
}

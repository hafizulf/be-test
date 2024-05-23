import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { WebResponse } from '../common/web.model';
import {
  CreateBorrowBookRequest,
  CreateBorrowBookResponse,
  TotalBorrowedBookMemberResponse,
  UpdateBorrowBookRequest,
  UpdateBorrowBookResponse
} from './member.model';

@Controller('/api/members')
export class MemberController {
  constructor(
    private service: MemberService,
  ) {}

  @HttpCode(200)
  @Get()
  async getMemberBorrowBooks():
  Promise<WebResponse<TotalBorrowedBookMemberResponse[]>> {
    const data = await this.service.getMemberBorrowBooks();
    return {
      status: 200,
      message: 'Member borrowed book fetched successfully',
      data,
    }
  }

  @Post('/borrow/:memberCode')
  async borrowBook(
    @Param('memberCode') memberCode: string,
    @Body() body: CreateBorrowBookRequest,
  ): Promise<WebResponse<CreateBorrowBookResponse>> {
    const { bookCodes } = body;
    const data = await this.service.borrowBook(memberCode, bookCodes);

    return {
      status: 200,
      message: 'Book borrowed successfully',
      data,
    }
  }

  @Put('/borrow/return/:memberCode')
  async returnBook(
    @Param('memberCode') memberCode: string,
    @Body() body: UpdateBorrowBookRequest,
  ): Promise<WebResponse<UpdateBorrowBookResponse>> {
    const { bookIds } = body;
    const data = await this.service.returnBook(memberCode, bookIds);
    return {
      status: 200,
      message: 'Book returned successfully',
      data,
    }
  }
}

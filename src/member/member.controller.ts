import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { WebResponse } from 'src/common/web.model';
import {
  CreateBorrowBookRequest,
  CreateBorrowBookResponse,
  MemberResponse,
  TotalBorrowedBookMemberResponse,
  UpdateBorrowBookRequest,
  UpdateBorrowBookResponse
} from './member.model';

@Controller('/api/members')
export class MemberController {
  constructor(
    private service: MemberService,
  ) {}

  @Get()
  @HttpCode(200)
  async get():
    Promise<WebResponse<MemberResponse[]>> {
    const members = await this.service.get();
    return {
      status: 200,
      message: 'Members fetched successfully',
      data: members,
    }
  }

  @HttpCode(200)
  @Get('/borrow/:memberCode')
  async getMemberBorrowBooks(
    @Param('memberCode') memberCode: string
  ): Promise<WebResponse<TotalBorrowedBookMemberResponse>> {
    const data = await this.service.getTotalBorrowed(memberCode);
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

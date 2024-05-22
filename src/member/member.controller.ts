import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { WebResponse } from 'src/common/web.model';
import { CreateBorrowBookRequest, CreateBorrowBookResponse, MemberResponse, TotalBorrowedBookMemberResponse } from './member.model';

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
  @Get('/borrowed/:memberCode')
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
}

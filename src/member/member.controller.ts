import { Controller, Get, HttpCode } from '@nestjs/common';
import { MemberService } from './member.service';
import { WebResponse } from 'src/common/web.model';
import { MemberResponse } from './member.model';

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
}

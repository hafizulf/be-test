import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMember } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    private repository: MemberRepository,
  ) {}

  async get():
    Promise<IMember[]> {
      return (
        (await this.repository.get())
          .map(member => member.unmarshal())
      );
    }
}

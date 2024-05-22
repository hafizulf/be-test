import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { MemberEntity } from "./member.entity";

@Injectable()
export class MemberRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async get(): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany();
    return members.map(member => MemberEntity.create(member));
  }

  async findMemberByCode(memberCode: string): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUnique({
      where: {
        code: memberCode
      }
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return MemberEntity.create(member);
  }
}

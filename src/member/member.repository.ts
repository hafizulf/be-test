import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

  async findMemberNotPenalizeByCode(memberCode: string): Promise<MemberEntity> {
    const member = await this.prismaService.member.findUnique({
      where: {
        code: memberCode,
      }
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if(member.penalized_at !== null) {
      throw new BadRequestException(
        'Member cannot borrow book because member is penalized'
      );
    }

    return MemberEntity.create(member);
  }

  async penalizeMember(
    memberCode: string,
  ): Promise<MemberEntity> {
    const penalizeMember = await this.prismaService.member.update({
      where: {
        code: memberCode
      },
      data: {
        penalized_at: new Date()
      }
    });
    return MemberEntity.create(penalizeMember);
  }
}

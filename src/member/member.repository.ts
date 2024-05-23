import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { MemberEntity } from "./member.entity";
import * as moment from 'moment';

@Injectable()
export class MemberRepository {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async findMembersWithTotalBorrowedBooks(): Promise<MemberEntity[]> {
    const members = await this.prismaService.member.findMany({
      include: {
        bookLoans: {
          where: {
            returnDate: null
          },
        }
      }
    });
    return members.map(member => MemberEntity.create(member));
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

    if(
      member.penalizedAt &&
      moment(member.penalizedAt).add(3, 'days') >= moment()
    ) {
      throw new BadRequestException(
        'Member cannot borrow book because member is penalized'
      );
    } else {
      await this.prismaService.member.update({
        where: {
          code: memberCode
        },
        data: {
          penalizedAt: null
        }
      })
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
        penalizedAt: new Date()
      }
    });
    return MemberEntity.create(penalizeMember);
  }
}

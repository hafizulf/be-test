import { Injectable } from "@nestjs/common";
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
}

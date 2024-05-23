import { IBookLoan } from "../book-loan/book-loan.entity";

export interface IMember {
  code: string;
  name: string;
  penalizedAt?: Date;
  bookLoans?: IBookLoan[];
}

export class MemberEntity  {
  props: IMember;

  constructor(props: IMember) {
    this.props = props;
  }

  static create(props: IMember): MemberEntity {
    return new MemberEntity(props);
  }

  public unmarshal(): IMember {
    return {
      code: this.code,
      name: this.name,
      penalizedAt: this.penalizedAt,
      bookLoans: this.bookLoans,
    }
  }

  public get code(): string {
    return this.props.code;
  }

  public get name(): string {
    return this.props.name;
  }

  public get penalizedAt(): Date | undefined {
    return this.props.penalizedAt;
  }

  public get bookLoans(): IBookLoan[] {
    return this.props.bookLoans;
  }
}

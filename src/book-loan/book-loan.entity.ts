export interface IBookLoan {
  id?: number;
  bookCode: string;
  memberCode: string;
  loanDate: Date;
  returnDate: Date;
  deletedAt?: Date;
}

export class BookLoanEntity {
  props: IBookLoan;

  constructor(props: IBookLoan) {
    this.props = props;
  }

  static create(props: IBookLoan): BookLoanEntity {
    return new BookLoanEntity(props);
  }

  unmarshal(): IBookLoan {
    return {
      id: this.id,
      bookCode: this.bookCode,
      memberCode: this.memberCode,
      loanDate: this.loanDate,
      returnDate: this.returnDate,
      deletedAt: this.deletedAt,
    }
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get bookCode(): string {
    return this.props.bookCode;
  }

  get memberCode(): string {
    return this.props.memberCode;
  }

  get loanDate(): Date {
    return this.props.loanDate;
  }

  get returnDate(): Date {
    return this.props.returnDate;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }
}

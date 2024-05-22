export interface IBookLoan {
  id?: number;
  bookCode: string;
  memberCode: string;
  loan_date?: Date;
  return_date?: Date;
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
      loan_date: this.loan_date,
      return_date: this.return_date,
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

  get loan_date(): Date | undefined {
    return this.props.loan_date;
  }

  get return_date(): Date | undefined {
    return this.props.return_date;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }
}

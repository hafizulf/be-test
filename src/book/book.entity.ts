export interface IBook {
  code: string;
  title: string;
  author: string;
  stock: number;
}

export class BookEntity {
  public props: IBook;

  constructor(
    props: IBook,
  ) {
    this.props = props;
  }

  public static create(props: IBook): BookEntity {
    return new BookEntity(props);
  }

  public unmarshal(): IBook {
    return {
      code: this.code,
      title: this.title,
      author: this.author,
      stock: this.stock,
    }
  }

  public get code(): string {
    return this.props.code;
  }
  public get title(): string {
    return this.props.title;
  }
  public get author(): string {
    return this.props.author;
  }
  public get stock(): number {
    return this.props.stock;
  }
}

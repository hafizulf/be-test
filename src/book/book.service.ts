import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { IBook } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    private repository: BookRepository,
  ) {}

  async getListAvailable(): Promise<IBook[]> {
    return (await this.repository.getListAvailable());
  }
}

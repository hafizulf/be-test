import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { BookResponse } from './book.model';
import { WebResponse } from '../common/web.model';
import { BookService } from './book.service';

@Controller('/api/books')
export class BookController {
  constructor(
    private service: BookService,
  ) {}

  @Get()
  @HttpCode(200)
  async getList():
    Promise<WebResponse<BookResponse[]>> {
    const books = await this.service.getListAvailable();
    return {
      status: HttpStatus.OK,
      message: 'Books fetched successfully',
      data: books,
    };
  }

  @Get('/booked')
  @HttpCode(200)
  async getListBooked():
    Promise<WebResponse<BookResponse[]>> {
    const books = await this.service.getListBooked();
    return {
      status: HttpStatus.OK,
      message: 'Books fetched successfully',
      data: books,
    };
  }
}

import { BookService } from './book.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from '../book/book.repository';
import { PrismaService } from '../common/prisma.service';
import { BookEntity } from './book.entity';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: BookRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        BookRepository,
        PrismaService,
      ]
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  describe('get books list available', () => {
    it('should return an array of books', async () => {
      jest
        .spyOn(bookRepository, "getListAvailable")
        .mockResolvedValue([
          {
            code: "123456",
            title: "Book 1",
            author: "Author 1",
            stock: 10
          },
          {
            code: "654321",
            title: "Book 2",
            author: "Author 2",
            stock: 5
          }
        ].map((book) => BookEntity.create(book)));

      const result = await service.getListAvailable();

      expect(bookRepository.getListAvailable).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      result.forEach(book => {
        expect(book).toBeInstanceOf(Object);
        expect(book.code).toBeDefined();
        expect(book.title).toBeDefined();
        expect(book.author).toBeDefined();
        expect(book.stock).toBeDefined();
      })
    });

    it('should return empty array', async () => {
      jest
        .spyOn(bookRepository, "getListAvailable")
        .mockResolvedValue([]);

      const result = await service.getListAvailable();

      expect(bookRepository.getListAvailable).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });
});

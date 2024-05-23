import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { BookLoanRepository } from '../book-loan/book-loan.repository';
import { ValidationService } from '../common/validation.service';
import { BookRepository } from '../book/book.repository';
import { PrismaService } from '../common/prisma.service';
import { IMember, MemberEntity } from './member.entity';
import { BookEntity, IBook } from '../book/book.entity';
import { BookLoanEntity, IBookLoan } from '../book-loan/book-loan.entity';
import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

describe('MemberService', () => {
  let service: MemberService;
  let validationService: ValidationService;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;
  let bookLoanRepository: BookLoanRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        ValidationService,
        MemberRepository,
        BookRepository,
        BookLoanRepository,
        PrismaService,
        // {
        //   provide: PrismaService,
        //   useValue: {
        //     $transaction: jest.fn().mockImplementation(async (callback) => {
        //       const result = await callback();
        //       return result;
        //     }),
        //   },
        // }
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    validationService = module.get<ValidationService>(ValidationService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookRepository = module.get<BookRepository>(BookRepository);
    bookLoanRepository = module.get<BookLoanRepository>(BookLoanRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('borrowBook', () => {
    afterAll(() => {
      jest.spyOn(prismaService, '$transaction').mockRestore();
      jest.spyOn(prismaService.member, 'findUnique').mockRestore();
      jest.spyOn(prismaService.bookLoan, "findMany").mockRestore();
      jest.spyOn(prismaService.bookLoan, 'findUnique').mockRestore();
      jest.spyOn(memberRepository, 'findMembersWithTotalBorrowedBooks').mockRestore();
      jest.spyOn(memberRepository, 'findMemberNotPenalizeByCode').mockRestore();
      jest.spyOn(bookRepository, 'findBookByCode').mockRestore();
      jest.spyOn(bookRepository, 'decrementStock').mockRestore();
      jest.spyOn(bookLoanRepository, 'bookingBooks').mockRestore();
      jest.spyOn(bookLoanRepository, "findByIdsAndMemberCode").mockRestore();
    });

    const mockMembers: IMember[] = [
      {
        code: 'member1',
        name: 'Member 1',
        bookLoans: [
          {
            bookCode: 'book1',
            memberCode: 'member1',
            loanDate: new Date(),
            returnDate: null,
          }
        ],
      },
    ];

    const mockBook: IBook = {
      code: 'book1',
      title: 'Book 1',
      author: 'Author 1',
      stock: 10,
    };

    const mockBookLoan: IBookLoan[] = [{
      bookCode: 'book1',
      memberCode: 'member1',
      loanDate: new Date(),
      returnDate: null,
    }];

    describe('get list of members with total borrowed books', () => {
      it('should return members with total borrowed books', async () => {
        jest
          .spyOn(memberRepository, 'findMembersWithTotalBorrowedBooks')
          .mockResolvedValue(
            mockMembers as MemberEntity[]
          );

        const result = await service.getMemberBorrowBooks();

        expect(memberRepository.findMembersWithTotalBorrowedBooks).toHaveBeenCalled();
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: 'member1',
              name: 'Member 1',
              totalBorrowedBooks: 1,
            }),
          ]),
        );
      });
    })


    describe('borrow book process', () => {
      it('should throw error when member not found when', async () => {
        jest
          .spyOn(prismaService, '$transaction')
          .mockImplementation(async (callback: (prisma: any) => Promise<any>) => {
            const mockPrisma = {};
            const result = await callback(mockPrisma);
            return result;
          });
        jest
          .spyOn(prismaService.member, 'findUnique')
          .mockResolvedValue(null);

          await expect(service.borrowBook('member1', ['book1']))
            .rejects.toThrow(
              new BadRequestException("Member not found")
            );
      });

      it('should throw error if member is penalized', async () => {
        jest
          .spyOn(prismaService.member, 'findUnique')
          .mockResolvedValue({
            ...mockMembers[0],
            penalizedAt: new Date(),
          } as MemberEntity);

          await expect(service.borrowBook('member1', ['book1']))
            .rejects.toThrow(
              new BadRequestException("Member cannot borrow book because member is penalized")
            );
      });

      it('should throw error when book not found', async () => {
        jest
          .spyOn(memberRepository, "findMemberNotPenalizeByCode")
          .mockResolvedValue(
            mockMembers[0] as MemberEntity
          );
        jest
          .spyOn(prismaService.book, 'findUnique')
          .mockResolvedValue(null);

          await expect(service.borrowBook('member1', ['book1']))
            .rejects.toThrow(
              new BadRequestException("Book not found")
            );
      });

      it('should throw error when books already borrowed', async () => {
        jest
          .spyOn(bookRepository, 'findBookByCode')
          .mockResolvedValue(
            mockBook as BookEntity
          );
        jest
          .spyOn(prismaService.bookLoan, "findMany")
          .mockResolvedValue(mockBookLoan as BookLoanEntity[]);

        await expect(service.borrowBook('member1', ['book1', 'book2']))
          .rejects.toThrow(
            new BadRequestException("Book is already borrowed by other member")
          );
      })

      it('should throw error when books borrowed more than two', async () => {
        await expect(service.borrowBook('member1', ['book2', 'book3'])) // loan more than two books
          .rejects.toThrow(
            new BadRequestException("Book is already borrowed by other member")
          );
      })

      it('should borrow book successfully', async () => {
        jest
          .spyOn(bookLoanRepository, 'bookingBooks')
          .mockResolvedValue(
            mockMembers[0].bookLoans as BookLoanEntity[]
          );
        jest
          .spyOn(bookRepository, 'decrementStock')
          .mockResolvedValue();

        const result = await service.borrowBook('member1', ['book1']);

        expect(prismaService.$transaction).toHaveBeenCalled();
        expect(memberRepository.findMemberNotPenalizeByCode).toHaveBeenCalled();
        expect(bookRepository.findBookByCode).toHaveBeenCalled();
        expect(bookLoanRepository.bookingBooks).toHaveBeenCalled();
        expect(bookRepository.decrementStock).toHaveBeenCalled();
        expect(result).toEqual({
          memberCode: 'member1',
          bookCodes: ['book1'],
        });
      });
    })

    describe('return book process', () => {
      it('should throw error when book not found', async () => {
        jest
          .spyOn(prismaService.bookLoan, 'findMany')
          .mockResolvedValue([]);

        await expect(service.returnBook("member1", [1]))
          .rejects.toThrow(
            new BadRequestException("Book loaned not found")
          );
      })

      it('should throw error when member not found', async () => {
        const mockData = [{
          id: 1,
          bookCode: "book1",
          memberCode: "member1",
          loanDate: moment().subtract(10, 'day').toDate(), // 10 days ago
        }];

        jest
          .spyOn(bookLoanRepository, "findByIdsAndMemberCode")
          .mockResolvedValue(mockData as BookLoanEntity[]);
        jest
          .spyOn(prismaService.member, 'findUnique')
          .mockResolvedValueOnce(null);

        await expect(service.returnBook("member1", [1, 2]))
          .rejects.toThrow(
            new BadRequestException("Member not found")
          )
      })

      it('should throw error when returning book is already returned', async () => {
        const mockData = [{
          id: 1,
          bookCode: "book1",
          memberCode: "member1",
          returnDate: moment().subtract(4, 'day').toDate(),
        }];

        jest
          .spyOn(bookLoanRepository, "findByIdsAndMemberCode")
          .mockResolvedValue(mockData as BookLoanEntity[]);
        jest
          .spyOn(prismaService.bookLoan, 'findUnique')
          .mockResolvedValueOnce(null);

        await expect(service.returnBook("member1", [1, 2]))
          .rejects.toThrow(
            new BadRequestException("Book loaned not found")
          )
      })

      it('should success return book', async () => {
        jest
          .spyOn(prismaService.member, 'findUnique')
          .mockResolvedValueOnce(mockMembers[0] as MemberEntity);
        jest
          .spyOn(bookLoanRepository, "returnBook")
          .mockResolvedValue(mockBookLoan[0] as BookLoanEntity);
        jest
          .spyOn(bookRepository, 'incrementStock')
          .mockResolvedValue();

        const result = await service.returnBook("member1", [1, 2]);

        expect(bookLoanRepository.returnBook).toHaveBeenCalled();
        expect(bookRepository.incrementStock).toHaveBeenCalled();
        expect(result).toEqual({
          memberCode: 'member1',
          bookCodes: ['book1'],
        });
      })
    })
  })
});

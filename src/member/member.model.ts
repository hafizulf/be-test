export class MemberResponse {
  code: string;
  name: string;
}

export class TotalBorrowedBookMemberResponse
  extends MemberResponse {
    totalBorrowedBooks: number;
}

export class CreateBorrowBookRequest {
  bookCodes: string[];
}

export class CreateBorrowBookResponse {
  memberCode: string;
  bookCodes: string[];
}

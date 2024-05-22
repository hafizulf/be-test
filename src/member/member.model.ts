export class MemberResponse {
  code: string;
  name: string;
}

export class TotalBorrowedBookMemberResponse
  extends MemberResponse {
    totalBorrowedBooks: number;
}

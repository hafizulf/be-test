import { z } from "zod";

export class MemberValidation {
  static readonly getTotalBorrowedSchema = z.object({
    memberCode: z.string().refine((code) => {
      if(code === ':memberCode' || code === '') {
        return false;
      }

      return true;
    }, {
      message: 'Member code is required',
    })
  })
}

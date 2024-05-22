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

  static readonly borrowBookSchema = this.getTotalBorrowedSchema.merge(z.object({
    bookCodes: z.array(z.string()).superRefine((bookCodes, ctx) => {
      if (bookCodes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one book code must be provided.'
        });
      }

      if (bookCodes.length > 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No more than two book codes can be provided.'
        });
      }

      return true;
    }),
  }))

  static readonly returnBorrowBookSchema = this.getTotalBorrowedSchema.merge(z.object({
    bookIds: z.array(z.number()).superRefine((bookIds, ctx) => {
      if (bookIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one book id must be provided.'
        });
      }

      return true;
    }),
  }))
}

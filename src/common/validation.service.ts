import { BadRequestException, Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: ZodType<T>, data: T): T {
    // return schema.parse(data);

    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        path: error.path.join('.'),
        message: error.message,
      }));

      throw new BadRequestException(errors);
    }
    return result.data as T;
  }
}

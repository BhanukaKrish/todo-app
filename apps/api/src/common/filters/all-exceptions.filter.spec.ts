import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

function run(exception: unknown) {
  const json = vi.fn((_body: unknown) => undefined);
  const status = vi.fn((_code: number) => ({ json }));
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  } as unknown as ArgumentsHost;

  new AllExceptionsFilter().catch(exception, host);
  return { status: status.mock.calls[0]?.[0], body: json.mock.calls[0]?.[0] };
}

describe('AllExceptionsFilter', () => {
  beforeAll(() =>
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined),
  );

  it('passes through HttpException messages', () => {
    expect(run(new NotFoundException('Nope'))).toEqual({
      status: 404,
      body: { statusCode: 404, message: 'Nope' },
    });
  });

  it('flattens ValidationPipe message arrays', () => {
    const { body } = run(
      new BadRequestException(['Title is required', 'Too long']),
    );
    expect(body).toEqual({
      statusCode: 400,
      message: 'Title is required',
      errors: ['Title is required', 'Too long'],
    });
  });

  it('maps mongoose cast errors to 400', () => {
    const err = new MongooseError.CastError('ObjectId', 'abc', '_id');
    expect(run(err).status).toBe(400);
  });

  it('hides internals for unknown errors', () => {
    expect(run(new Error('db password leaked'))).toEqual({
      status: 500,
      body: {
        statusCode: 500,
        message: 'Something went wrong on our side. Please try again.',
      },
    });
  });
});

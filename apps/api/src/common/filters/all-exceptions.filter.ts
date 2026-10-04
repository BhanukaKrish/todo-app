import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiErrorBody } from '@todo/shared';
import type { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

/**
 * Normalises every error into the `ApiErrorBody` contract so the client
 * only has to handle a single error shape.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toBody(exception);

    if (body.statusCode >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): ApiErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const res = exception.getResponse();
      const raw =
        typeof res === 'string' ? res : (res as { message?: unknown }).message;

      // ValidationPipe reports an array of messages; surface the first as the summary.
      if (Array.isArray(raw)) {
        return {
          statusCode,
          message: String(raw[0] ?? 'Validation failed'),
          errors: raw.map(String),
        };
      }
      return {
        statusCode,
        message: typeof raw === 'string' ? raw : exception.message,
      };
    }

    if (exception instanceof MongooseError.ValidationError) {
      const errors = Object.values(exception.errors).map((e) => e.message);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: errors[0] ?? 'Validation failed',
        errors,
      };
    }

    if (exception instanceof MongooseError.CastError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid value for "${exception.path}"`,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong on our side. Please try again.',
    };
  }
}

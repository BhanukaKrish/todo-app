import {
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_TITLE_MAX_LENGTH,
  type CreateTodoInput,
} from '@todo/shared';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTodoDto implements CreateTodoInput {
  @Transform(trim)
  @IsString({ message: 'Title must be text' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(TODO_TITLE_MAX_LENGTH, {
    message: `Title must be at most ${TODO_TITLE_MAX_LENGTH} characters`,
  })
  title: string;

  @Transform(trim)
  @IsOptional()
  @IsString({ message: 'Description must be text' })
  @MaxLength(TODO_DESCRIPTION_MAX_LENGTH, {
    message: `Description must be at most ${TODO_DESCRIPTION_MAX_LENGTH} characters`,
  })
  description?: string;
}

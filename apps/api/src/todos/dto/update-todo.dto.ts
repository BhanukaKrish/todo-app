import { PartialType } from '@nestjs/mapped-types';
import type { UpdateTodoInput } from '@todo/shared';
import { CreateTodoDto } from './create-todo.dto.js';

export class UpdateTodoDto
  extends PartialType(CreateTodoDto)
  implements UpdateTodoInput {}

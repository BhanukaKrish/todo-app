import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodosService } from './todos.service.js';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Put(':id')
  update(@Param('id', IsObjectIdPipe) id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, dto);
  }

  @Patch(':id/done')
  toggleDone(@Param('id', IsObjectIdPipe) id: string) {
    return this.todosService.toggleDone(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.todosService.remove(id);
  }
}

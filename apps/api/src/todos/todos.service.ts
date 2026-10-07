import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo, TodoDocument } from './schemas/todo.schema.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  findAll(): Promise<TodoDocument[]> {
    return this.todoModel.find().sort({ createdAt: -1 }).exec();
  }

  create(dto: CreateTodoDto): Promise<TodoDocument> {
    return this.todoModel.create(dto);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<TodoDocument> {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, dto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    return this.ensureFound(todo, id);
  }

  async toggleDone(id: string): Promise<TodoDocument> {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, [{ $set: { done: { $not: '$done' } } }], {
        returnDocument: 'after',
        updatePipeline: true,
      })
      .exec();
    return this.ensureFound(todo, id);
  }

  async remove(id: string): Promise<void> {
    const todo = await this.todoModel.findByIdAndDelete(id).exec();
    this.ensureFound(todo, id);
  }

  private ensureFound(todo: TodoDocument | null, id: string): TodoDocument {
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }
    return todo;
  }
}

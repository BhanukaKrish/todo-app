import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_TITLE_MAX_LENGTH,
} from '@todo/shared';
import { HydratedDocument } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
      return ret;
    },
  },
})
export class Todo {
  @Prop({ required: true, trim: true, maxlength: TODO_TITLE_MAX_LENGTH })
  title: string;

  @Prop({ trim: true, maxlength: TODO_DESCRIPTION_MAX_LENGTH })
  description?: string;

  @Prop({ default: false, index: true })
  done: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

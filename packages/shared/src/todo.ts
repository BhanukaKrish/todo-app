export const TODO_TITLE_MAX_LENGTH = 120;
export const TODO_DESCRIPTION_MAX_LENGTH = 1000;

export interface Todo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  errors?: string[];
}

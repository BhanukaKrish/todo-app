export const TODO_TITLE_MAX_LENGTH = 120;
export const TODO_DESCRIPTION_MAX_LENGTH = 1000;

/** A TODO item as returned by the API. Dates are ISO-8601 strings. */
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

/** Shape of every non-2xx response body from the API. */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  errors?: string[];
}

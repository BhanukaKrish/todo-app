import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Connection } from 'mongoose';
import request from 'supertest';
import type { App } from 'supertest/types.js';

describe('Todos API (e2e)', () => {
  let mongo: MongoMemoryServer;
  let app: INestApplication<App>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    // ConfigModule validates env at import time, so set it before loading the module.
    process.env.MONGODB_URI = mongo.getUri('todos');

    const { AppModule } = await import('../src/app.module.js');
    const { configureApp } = await import('../src/app.setup.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.get<Connection>(getConnectionToken()).dropDatabase();
  });

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  const api = () => request(app.getHttpServer());
  const createTodo = (body: object) =>
    api().post('/api/todos').send(body).expect(201);

  it('creates a todo and lists it newest first', async () => {
    await createTodo({ title: 'First' });
    const { body: second } = await createTodo({
      title: '  Second  ',
      description: 'details',
    });

    expect(second).toMatchObject({
      title: 'Second',
      description: 'details',
      done: false,
    });
    expect(second.id).toEqual(expect.any(String));
    expect(second._id).toBeUndefined();

    const { body } = await api().get('/api/todos').expect(200);
    expect(body.map((t: { title: string }) => t.title)).toEqual([
      'Second',
      'First',
    ]);
  });

  it('rejects an empty title with a readable message', async () => {
    const { body } = await api()
      .post('/api/todos')
      .send({ title: '   ' })
      .expect(400);
    expect(body).toMatchObject({
      statusCode: 400,
      message: 'Title is required',
    });
  });

  it('rejects unknown fields', async () => {
    await api().post('/api/todos').send({ title: 'x', done: true }).expect(400);
  });

  it('updates title and description', async () => {
    const { body: todo } = await createTodo({ title: 'Old' });
    const { body } = await api()
      .put(`/api/todos/${todo.id}`)
      .send({ title: 'New', description: 'Updated' })
      .expect(200);
    expect(body).toMatchObject({
      id: todo.id,
      title: 'New',
      description: 'Updated',
    });
  });

  it('toggles done back and forth', async () => {
    const { body: todo } = await createTodo({ title: 'Toggle me' });
    const first = await api().patch(`/api/todos/${todo.id}/done`).expect(200);
    expect(first.body.done).toBe(true);
    const second = await api().patch(`/api/todos/${todo.id}/done`).expect(200);
    expect(second.body.done).toBe(false);
  });

  it('deletes a todo', async () => {
    const { body: todo } = await createTodo({ title: 'Bye' });
    await api().delete(`/api/todos/${todo.id}`).expect(204);
    await api().delete(`/api/todos/${todo.id}`).expect(404);
  });

  it('returns 400 for malformed ids and 404 for missing ones', async () => {
    await api().put('/api/todos/not-an-id').send({ title: 'x' }).expect(400);
    const { body } = await api()
      .patch('/api/todos/507f1f77bcf86cd799439011/done')
      .expect(404);
    expect(body.message).toContain('was not found');
  });
});

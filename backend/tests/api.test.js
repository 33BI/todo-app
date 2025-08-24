const request = require('supertest');
const app = require('../server');

describe('Todo API', () => {
  let authToken;
  let testTodoId;

  const testUser = { username: 'admin', password: 'admin' };
  const testTodo = { title: 'Test Todo' };

  describe('Authentication', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app).post('/login').send(testUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it('rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'wrong', password: 'wrong' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Todo Operations (CRUD)', () => {
    beforeAll(async () => {
      const loginRes = await request(app).post('/login').send(testUser);
      authToken = loginRes.body.token;
    });

    it('fetches all todos', async () => {
      const res = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('creates a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTodo);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(testTodo.title);
      expect(res.body.completed).toBe(false);

      testTodoId = res.body.id;
    });

    it('rejects todo creation without title', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it('updates a todo successfully', async () => {
      const updates = { title: 'Updated todo', completed: true };

      const res = await request(app)
        .put(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updates.title);
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for updating non-existent todo', async () => {
      const res = await request(app)
        .put('/todos/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Attempted update' });

      expect(res.statusCode).toBe(404);
    });

    it('deletes a todo', async () => {
      const res = await request(app)
        .delete(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(204);

      const getRes = await request(app)
        .get(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.statusCode).toBe(404);
    });

    it('returns 204 for deleting non-existent todo', async () => {
      const res = await request(app)
        .delete('/todos/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(204);
    });
  });

  describe('Authorization Guard', () => {
    it('rejects unauthenticated access to protected routes', async () => {
      const endpoints = [
        { method: 'get', path: '/todos' },
        { method: 'post', path: '/todos' },
        { method: 'put', path: '/todos/some-id' },
        { method: 'delete', path: '/todos/some-id' }
      ];

      for (const { method, path } of endpoints) {
        const res = await request(app)[method](path);
        expect(res.statusCode).toBe(401);
      }
    });
  });
});

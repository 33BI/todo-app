const request = require('supertest');
const app = require('../server');

describe('Todo API', () => {
  let authToken;
  let testTodoId;

  const testUser = { username: 'admin', password: 'admin' };
  const testTodo = { title: 'Test Todo' };

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send(testUser);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'wrong', password: 'wrong' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Todo Operations', () => {
    beforeAll(async () => {
      const loginRes = await request(app)
        .post('/login')
        .send(testUser);
      authToken = loginRes.body.token;
    });

    it('should get all todos', async () => {
      const res = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTodo);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual(testTodo.title);
      expect(res.body.completed).toBe(false);
      testTodoId = res.body.id;
    });

    it('should reject todo creation without title', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(res.statusCode).toEqual(400);
    });

    it('should update a todo', async () => {
      const updates = { title: 'Updated todo', completed: true };
      const res = await request(app)
        .put(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual(updates.title);
      expect(res.body.completed).toBe(updates.completed);
    });

    it('should return 404 when updating non-existent todo', async () => {
      const res = await request(app)
        .put('/todos/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated todo' });
      
      expect(res.statusCode).toEqual(404);
    });

    it('should delete a todo', async () => {
      const res = await request(app)
        .delete(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(204);
      
      const getRes = await request(app)
        .get(`/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 204 when deleting non-existent todo', async () => {
      const res = await request(app)
        .delete('/todos/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(204);
    });
  });

  describe('Authorization', () => {
    it('should reject unauthenticated requests', async () => {
      const endpoints = [
        { method: 'get', path: '/todos' },
        { method: 'post', path: '/todos' },
        { method: 'put', path: `/todos/${testTodoId}` },
        { method: 'delete', path: `/todos/${testTodoId}` }
      ];

      for (const endpoint of endpoints) {
        const res = await request(app)[endpoint.method](endpoint.path);
        expect(res.statusCode).toEqual(401);
      }
    });
  });
});
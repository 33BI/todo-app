const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json()); 


const users = [{ id: '1', username: 'admin', password: 'admin' }];

let todos = [
  { id: uuidv4(), title: 'Learn testing', completed: false },
  { id: uuidv4(), title: 'Write tests', completed: false }
];

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];

  if (token !== 'fake-jwt-token') {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  next();
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    return res.json({ token: 'fake-jwt-token' });
  }

  res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
});

app.get('/todos', authenticate, (req, res) => {
  res.json(todos);
});

app.post('/todos', authenticate, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Bad Request: Title is required' });
  }

  const newTodo = { id: uuidv4(), title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.put('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Not Found: Todo not found' });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});


app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== id);


  res.status(204).end();
});

const PORT = 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

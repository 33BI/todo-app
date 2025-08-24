import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    if (isLoggedIn) fetchTodos();
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: 'fake-jwt-token' }
      });
      setTodos(res.data);
    } catch (err) {
      setError('Failed to load todos');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      if (res.data.token) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTodos([]);
  };

  const addTodo = async () => {
    if (!title.trim()) {
      setError('Todo title cannot be empty');
      return;
    }
    try {
      await axios.post(`${API_URL}/todos`, { title }, {
        headers: { Authorization: 'fake-jwt-token' }
      });
      setTitle('');
      fetchTodos();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: 'fake-jwt-token' }
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: 'fake-jwt-token' }
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <h2 data-testid="login-header">Todo Application</h2>
            {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                data-testid="username-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                data-testid="password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button data-testid="login-button" type="submit">Login</button>
            </form>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button data-testid="logout-button" onClick={handleLogout}>Logout</button>
        <h2 data-testid="todo-header">Todo List</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <input
            data-testid="todo-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add new todo"
          />
          <button data-testid="add-button" onClick={addTodo}>Add</button>
        </div>
        <ul data-testid="todo-list">
          {todos.map(todo => (
            <li key={todo.id} data-testid="todo-item">
              <input
                data-testid={`checkbox-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
              </span>
              <button data-testid={`delete-${todo.id}`} onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import { Todo } from './types';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Initialize theme from local storage
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.body.className = isDarkTheme ? 'dark' : 'light';
  }, [isDarkTheme]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodoText, completed: false },
      ]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <button className="theme-toggle" onClick={() => setIsDarkTheme(!isDarkTheme)}>
        {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      </button>
      <div className="new-todo">
        <input 
          type="text" 
          value={newTodoText} 
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter a new todo..."
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
    </div>
  );
};

export default App;

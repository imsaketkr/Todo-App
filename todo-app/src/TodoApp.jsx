import { useState, useEffect } from 'react';
import { X, Check, Undo2, Redo2, Plus, Trash } from 'lucide-react';
import './TodoApp.css';

export default function TodoApp() {
  // State for todos, past states for undo/redo, and new todo input
  const [todos, setTodos] = useState([]);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');

  // Save todos to local storage whenever they change
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to save current state before changes
  const saveState = () => {
    setPast([...past, todos]);
    setFuture([]);
  };

  // Add a new todo
  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    saveState();
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodoText,
        completed: false
      }
    ]);
    setNewTodoText('');
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    saveState();
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    saveState();
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Undo last action
  const undo = () => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture([todos, ...future]);
    setPast(newPast);
    setTodos(previous);
  };

  // Redo last undone action
  const redo = () => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, todos]);
    setFuture(newFuture);
    setTodos(next);
  };

  // Handle enter key for adding todos
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h1>Todo List</h1>
        </div>
        
        {/* History controls */}
        <div className="history-controls">
          <button 
            onClick={undo} 
            disabled={past.length === 0}
            className={`history-button ${past.length === 0 ? 'disabled' : ''}`}
          >
            <Undo2 size={16} className="icon" />
            <span>Undo</span>
          </button>
          <button 
            onClick={redo} 
            disabled={future.length === 0}
            className={`history-button ${future.length === 0 ? 'disabled' : ''}`}
          >
            <span>Redo</span>
            <Redo2 size={16} className="icon" />
          </button>
        </div>
        
        {/* Add todo form */}
        <div className="add-todo-form">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button 
            onClick={addTodo}
            className="add-button"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {/* Todo list */}
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">No tasks yet. Add one above!</li>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className="todo-item">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`todo-checkbox ${todo.completed ? 'completed' : ''}`}
                >
                  {todo.completed && <Check size={14} className="check-icon" />}
                </button>
                <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="todo-footer">
          {todos.filter(t => t.completed).length} of {todos.length} tasks completed
        </div>
      </div>
    </div>
  );
}
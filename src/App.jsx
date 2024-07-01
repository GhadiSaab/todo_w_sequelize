import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./style.css";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // Load tasks 
  useEffect(() => {
    console.log("Loading todos from local storage");
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
      console.log("Loaded todos:", JSON.parse(storedTodos));
    }
  }, []);

  // Save tasks 
  useEffect(() => {
    console.log("Saving todos to local storage", todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();

    if (newItem.trim() === "") return;

    const currentTime = new Date().toLocaleString(); 

    setTodos((currentTodos) => {
      const updatedTodos = [...currentTodos, { id: crypto.randomUUID(), title: newItem, completed: false, time: currentTime }];
      console.log("New todos after add:", updatedTodos);
      return updatedTodos;
    });

    setNewItem("");
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      const updatedTodos = currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed };
        }
        return todo;
      });
      console.log("New todos after toggle:", updatedTodos);
      return updatedTodos;
    });
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      const updatedTodos = currentTodos.filter(todo => todo.id !== id);
      console.log("New todos after delete:", updatedTodos);
      return updatedTodos;
    });
  }

  function renameTodo(id, newTitle) {
    setTodos(currentTodos => {
      const updatedTodos = currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title: newTitle };
        }
        return todo;
      });
      console.log("New todos after rename:", updatedTodos);
      return updatedTodos;
    });
  }

  return (
    <>
      <h1>TODO LIST</h1>
      <div className="add-task-container">
        <Popup
          trigger={<button className="add-task">Add Task</button>}
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <form className="content" onSubmit={handleSubmit}>
                <div className="aa">Add new task</div>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="popup-input"
                  placeholder="Name of task"
                />
                <div className="button-container">
                  <button type="submit" className="popup-addtask-btn">
                    Add Task
                  </button>
                  <button type="button" onClick={close} className="close-btn">
                    X
                  </button>
                </div>
              </form>
            </div>
          )}
        </Popup>
        <select className="drop-down">
          <option value="all">All</option>
        </select>
      </div>
      {todos.length === 0 ? (
        <div className="empty-message">
          Add your first task
        </div>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <li key={todo.id} className="card">
              <label>
                <input type="checkbox" checked={todo.completed} readOnly
                  onChange={e => toggleTodo(todo.id, e.target.checked)} />
                <span className="task-title">{todo.title}</span>
              </label>
              <span className="task-time">{todo.time}</span>
              <div className="card-buttons">
                <Popup trigger={<button className="btn edit-btn">✏️</button>}
                  modal
                  nested>
                  {(close) => (
                    <div className="modal">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="popup-input-rename"
                        placeholder="Rename task"
                      />
                      <div className="button-container">
                        <button type="button" className="popup-addtask-btn" onClick={() => { renameTodo(todo.id, newTitle); close(); }}>
                          Rename Task
                        </button>
                        <button type="button" onClick={close} className="close-btn">
                          X
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
                <button className="btn delete-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

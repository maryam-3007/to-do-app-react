import { useState, useRef, useEffect } from "react";
import './todo.css';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const listEndRef = useRef(null);

  const addTask = () => {
    if (!text.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text, done: false }]);
    setText("");
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks(prev => prev.map(task => task.id === id ? { ...task, text: editingText } : task));
    setEditingId(null);
    setEditingText("");
  };

  const toggleDone = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks]);

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo App</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
      </div>

      <div className="todo-list-container">
        <ul className="todo-list list-unstyled">
          {tasks.map(task => (
            <li key={task.id}>
              {editingId === task.id ? (
                <>
                  <input
                    className="form-control me-2"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button className="btn btn-success btn-edit" onClick={() => saveEdit(task.id)}>Save</button>
                </>
              ) : (
                <>
                  <span
                    className={`todo-text ${task.done ? "done" : ""}`}
                    onClick={() => toggleDone(task.id)}
                    title="Click to mark as done"
                  >
                    {task.text}
                  </span>
                  <div>
                    <button className="btn btn-warning btn-edit me-1" onClick={() => startEdit(task)}>Edit</button>
                    <button className="btn btn-danger btn-edit me-1" onClick={() => deleteTask(task.id)}>Delete</button>
                    <button
                      className={`btn btn-${task.done ? "secondary" : "success"} btn-edit`}
                      onClick={() => toggleDone(task.id)}
                    >
                      {task.done ? "Undo" : "Done"}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          <div ref={listEndRef} />
        </ul>
      </div>

      {tasks.length === 0 && <p className="text-center text-muted mt-3">No tasks yet.</p>}
    </div>
  );
}

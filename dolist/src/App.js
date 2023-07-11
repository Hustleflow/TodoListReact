import React, { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]);
          setNewTodo("");
        });
    }
  };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodos.find((todo) => todo.id === id)),
    });
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            <span onClick={() => handleToggleTodo(todo.id)}>{todo.title}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

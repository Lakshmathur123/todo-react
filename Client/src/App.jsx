import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() =>{

    // const storedTodo =JSON.parse( localStorage.getItem('todos'));
    // setTodos(storedTodo);
    fetch("http://localhost:5000/todo")
    .then((res) => res.json())
    .then((data) => res.json())
    .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const handleAddTodo = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTodo = {
        description: inputValue.trim(),
        completed: false,
      };

      fetch("http://localhost:5000/todo", {
        method: "POST",
        headers: {"Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
      .then((res) => res.json())
      .then((addedTodo) => {
        setTodos([...todos, addedTodo.rows[0]]);
        setInputValue("");
      })
      .catch((error) => console.error("Error adding the todo", error));
    }
  };

  const handleCheckboxChange = (id) => {
    const updatedTodos = todos.find((todo) => todo.todo_id === id);
    const updatedCompleted = !updatedTodos.completed;

    fetch(`http://localhost:5000/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({completed: updatedCompleted}),
    })
    .then(() => {
      const updatedTodos = todos.map((todo) =>todo.todo_id === id ? {...todo, completed:updatedCompleted} : todo);
      setTodos(updatedTodos);
    })
    .catch((error) => console.error("Error checking todo: ", error));
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:5000/todo/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      const updatedTodos = todos.filter((todo) => todo.todo_id !== id);
      setTodos(updatedTodos);
    })
    .catch((error) => console.error("Error deleting the todo", error));
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    Promise.all(
      completedTodos.map((todo) =>
      fetch(`http://localhost:5000/todo/${todo.todo_id}`,{
        method: "DELETE",
      })
    )
    )
      .then(() => {
        const updatedTodos = todos.filter((todo) => !todo.completed);
        setTodos(updatedTodos);
       })
       .catch((error) => console.error("Error clearing completed todos:", error));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true; 
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="App">
      <header className="header-bg"></header>
      <div className="wrapper">
        <div className="container-header">
          <h3>Todo</h3>
          <img src="/images/icon-sun.svg" alt="Todo" className="mode-btn" />
        </div>
        <div className="container">
          <div className="input-container">
            <input
              type="text"
              className="input"
              placeholder="Create a new todo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleAddTodo}
            />
          </div>
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div key={todo.todo_id} className="todo">
                <div className="todo-left">
                  <label
                    className={`checkbox ${todo.completed ? "active-todo" : ""}`}
                    aria-label={`Mark ${todo.description} as ${todo.completed ? "incomplete" : "complete"}`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(todo.todo_id)}
                    />
                  </label>
                  <p className="todo-text">{todo.description}</p>
                </div>
                <img
                  src="/images/icon-cross.svg"
                  alt="Delete"
                  className="delete"
                  onClick={() => handleDeleteTodo(todo.todo_id)}
                />
              </div>
            ))}
          </div>

          <div className="todo-footer">
            <p>
              <span id="listLength">{activeTodosCount}</span> items left
            </p>
            <div className="filter">
              <button className={`filter-btn ${filter === "All" ? "footer-active" : ""}`} onClick={() => setFilter("All")}>All</button>
              <button className={`filter-btn ${filter === "Active" ? "footer-active" : ""}`} onClick={() => setFilter("Active")}>Active</button>
              <button className={`filter-btn ${filter === "Completed" ? "footer-active" : ""}`} onClick={() => setFilter("Completed")}>Completed</button>
            </div>
            <button className="clear-completed" onClick={clearCompletedTodos}>
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

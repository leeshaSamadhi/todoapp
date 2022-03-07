import { useState, useEffect } from "react";
import "./index.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popup, setPopup] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [deleted, setDeleted] = useState("");

  useEffect(() => {
    const GetTodos = () => {
      fetch(API_BASE + "/todos")
        .then((res) => res.json())
        .then((data) => setTodos(data))
        .catch((err) => console.error("error", err));
    };
    GetTodos();
  }, []);

  

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + '/todo/complete/' + id)
    .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id){
        todo.complete = data.complete;
      }
      return todo;
    }));
  }

const CreateTodo = async () => {
  const data = await fetch(API_BASE + '/todo/new', {
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: newTodo
    })
  }).then(res => res.json());

  //get the current todods and add the new one; close pop up and setNewTodo to do nothing.
  setTodos([...todos, data]);
  setPopup(false);
  setNewTodo("");
}


const deleteTodo = async id => {
    const data = await fetch(API_BASE + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());
    setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
    console.log(data);
}


  return (
    <div className="body">
      <div className="todo-body">
        <h1>Todo App</h1>
        <h3>Tasks</h3>
        <button className="new-task" onClick={()=> setPopup(true)}>New Task</button>
        <div className="todo-container">
          <span>Total Tasks ({todos.length}) </span>
            {todos.map(todo => (
              <div className={"todo-item" + (todo.complete ? " is-complete" : "")}key={todo._id} onClick={()=> completeTodo(todo._id)}>
                <div className="checkbox"></div>
                <div className="text">{todo.text} </div>
                <button className="delete-item" onClick={() => deleteTodo(todo._id)}>x</button>
              </div>
            ))}
        </div>
      </div>
      
      
      {popup ? (
        <div className="newtask-popup">
          <button className="close-popup" onClick={()=> setPopup(false)}>x</button>
          <div className="newtask-body">
            <h3>Create a task</h3>
            <input
              type="text"
              className="createtask-input"
              onChange={e => setNewTodo(e.target.value)}
              value={newTodo}/>  

            <button className="createtask-button" onClick={CreateTodo}>Add task</button>
          </div>  
        </div>
      ) : ""}
    </div>
  );
}

export default App;

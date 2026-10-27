import React, { useEffect, useRef, useState } from "react";
import TodoCard from "./components/TodoCard";
import axios from "axios";


// const BACKEND_URL = "http://localhost:8080";
const BACKEND_URL = "https://todo-backend-8gme.onrender.com";

function App() {
  const [todos, setTodos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // search query
  const [search, setSearch] = useState("");
  const searchQueryRef = useRef();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTodoEditId(null);
    setTodoForm(initializeTodoForm);
  };

  // modal todo form data state
  const initializeTodoForm = {
    title: "",
    description: "",
  };
  const [todoEditId, setTodoEditId] = useState(null);
  const [todoForm, setTodoForm] = useState(initializeTodoForm);

  const handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTodo = async (todoId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/todo/${todoId}`);
      const { _id, title, description } = response.data.todos;

      setTodoEditId(_id)
      setIsModalOpen(true);

      setTodoForm({
        title: title,
        description: description,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateTodoForm = async (e) => {
    try {
      debugger;
      e.preventDefault();
      const response = await axios.put(`${BACKEND_URL}/todo/${todoEditId}`, todoForm);
      if (response.status === 200) {
        alert("updated successfully");
        setTodoEditId(null);
        handleGetTodos();
        setTodoForm(initializeTodoForm);
        setIsModalOpen(false);
      }
      
    } catch (error) {
      console.log("error",error)
    }
  };

  const handleGetTodos = async () => {
    try {
      setIsLoading(true);

      const TODO_URL = `${BACKEND_URL}/todo?search=${search}&page=${page}&limit=${limit}`;
      const response = await axios.get(TODO_URL);
      const todos = response.data.todos;
      const totoTodosDocument = response.data.totalDocumentsCount;
      const todoLimit = response.data.limit;
      console.log("limit", todoLimit);

      const totalPages = Math.ceil(totoTodosDocument / todoLimit);
      setTotalPages(totalPages);

      console.log(todos);

      setTodos(todos);
      setIsLoading(false);
    } catch (error) {
      console.log("'error", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchQuery = () => {
    const value = searchQueryRef.current.value;
    console.log("value", value);
    setSearch(value);
  };

  console.log("search", search);

  const handlePagination = (page) => {
    setPage(page);
  };

  const handleChangePageLimit = (e) => {
    const value = e.target.value;
    setLimit(value);
  };

  // ! HANDLE DELETE TODO
  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/todo/${todoId}`,
      );
      alert("deleted successfully");
      handleGetTodos();
    } catch (error) {
      console.log("error", error);
    }
  };

  // ! ADD TODO
  const handleAddTodo = () => {
    setIsModalOpen(true);
  }

  const handleAddTodoForm = async (e) => {
    try {
      e.preventDefault();
        const response = await axios.post(`${BACKEND_URL}/todo`, todoForm);
        if (response.status === 201) {
          alert("todo created");
          setIsModalOpen(false);
          setTodoForm(initializeTodoForm);
          handleGetTodos();
        }
      } catch (error) {
        console.log("error",error)
      }
  }

  useEffect(() => {
    handleGetTodos();
  }, [page, limit, search]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1> {error} </h1>;
  }

  return (
    <>

      <h1 className='text-4xl font-bold'> Todo Application </h1>
      <input
        ref={searchQueryRef}
        className=" mx-8 my-4 w-6/12  px-4 py-2 rounded border outline-none border-slate-600"
        type="text"
        placeholder="search using title..."
      />
      <button
        onClick={handleSearchQuery}
        className="bg-violet-600 text-white font-semibold px-6 py-2 rounded-md"
      >
        Search
      </button>

      <button
        onClick={() => handleAddTodo()}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md mx-8"
      >
        Add Todo
      </button>

      <div className="p-8 grid grid-cols-3 gap-6">
        {todos.map((todo, i) => {
          const { _id: id, title, description } = todo;
          return (
            <div className="p-4 rounded-lg shadow-md space-y-2">
              {/* todo title -> question */}
              <h2 className="text-xl font-semibold"> {title} </h2>
              {/* todo description -> answer */}
              <p className="text-gray-700">{description}</p>
              <div className="space-x-1.5">
                <button
                  onClick={() => handleEditTodo(id)}
                  className="bg-green-600 text-white font-semibold px-6 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(id)}
                  className="bg-red-600 text-white font-semibold px-6 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}
      <div className="m-4 flex justify-between max-w-6xl mx-auto">
        {/* pagination page set */}
        <div className="flex gap-4">
          {Array(totalPages)
            .fill(0)
            .map((ele, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handlePagination(index + 1)}
                  className={` px-4 cursor-pointer py-2- rounded ${index + 1 == page ? "bg-blue-600 text-white font-semibold" : "bg-slate-200"}`}
                >
                  {index + 1}
                </button>
              );
            })}
        </div>

        {/* content limit */}
        <div>
          <label htmlFor="page-limit">page limit per page</label>
          <select
            onChange={handleChangePageLimit}
            name="limit"
            id="limit"
            className="border border-slate-600 px-4 py-2"
          >
            <option value={`${limit}`}>{limit}</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* modal */}
      <div
        className={` ${!isModalOpen && "hidden"}  w-full bg-black/70 min-h-screen fixed top-0 left-0`}
      >
        <section className="w-5/12 mx-auto  bg-white/90  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl">
          <button
            onClick={() => handleCloseModal()}
            className="font-bold px-4 py-2   text-white cursor-pointer bg-red-600 w-fit"
          >
            X
          </button>
          <form
            onSubmit={todoEditId ? handleUpdateTodoForm : handleAddTodoForm}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <label className="text-xl font-bold" htmlFor="title">
                Title
              </label>
              <input
                className="outline-none border border-slate-400 px-4 py-2 rounded"
                type="text"
                placeholder="Enter todo title"
                name="title"
                onChange={handleChangeInput}
                value={todoForm.title}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl font-bold" htmlFor="description">
                Description
              </label>
              <textarea
                type="text"
                placeholder="Enter todo description"
                className="outline-none border border-slate-400 px-4 py-2 rounded"
                name="description"
                onChange={handleChangeInput}
                value={todoForm.description}
              ></textarea>
            </div>

            <button
              type="submit"
              className={`${todoEditId ? 'bg-green-600': 'bg-blue-600'} capitalize text-white font-semibold py-2 rounded `}
            >
              {
                todoEditId ? 'update todo' : 'add todo'
              }
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default App;

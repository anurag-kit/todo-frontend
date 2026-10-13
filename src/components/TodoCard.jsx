import React from "react";

function TodoCard({ todo }) {
  const { _id: id, title, description } = todo;
  return (
    <div className="p-4 rounded-lg shadow-md space-y-2">
      {/* todo title -> question */}
      <h2 className="text-xl font-semibold"> {title} </h2>
      {/* todo description -> answer */}
      <p className="text-gray-700">{description}</p>
      <div className="space-x-1.5">
        <button className="bg-green-600 text-white font-semibold px-6 py-1 rounded">
          Edit
        </button>
        <button className="bg-red-600 text-white font-semibold px-6 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoCard;

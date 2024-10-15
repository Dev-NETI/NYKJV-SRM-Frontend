import React from "react";

function ButtonComponent({ label, type = "submit", ...props }) {
  return (
    <button
      type={type}
      className="bg-blue-600 py-2 px-4 rounded-md text-white shadow-sm shadow-blue-800"
      {...props}
    >
      {label}
    </button>
  );
}

export default ButtonComponent;

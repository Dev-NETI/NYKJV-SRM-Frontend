import React from "react";

function LoadingComponent({ label }) {
  return (
    <button type="button" className="bg-indigo-500 rounded-full p-4" disabled>
      <p className="text-slate-100 font-semibold animate-pulse">{label}</p>
    </button>
  );
}

export default LoadingComponent;

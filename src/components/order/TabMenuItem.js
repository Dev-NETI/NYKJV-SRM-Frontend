import React from "react";

function TabMenuItem({ label, onClick, active }) {
  const style = active ? " text-blue-700 font-semibold " : " text-stone-800 ";
  return (
    <div>
      <p className={`${style} text-base `} onClick={onClick}>
        {label}
      </p>
    </div>
  );
}

export default TabMenuItem;

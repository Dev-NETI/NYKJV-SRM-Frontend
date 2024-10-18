import React from "react";

function DocumentListItemFooterComponent({ label }) {
  return (
    <div className="overflow-hidden">
      <p className="text-xs italic text-stone-600 truncate">{label}</p>
    </div>
  );
}

export default DocumentListItemFooterComponent;

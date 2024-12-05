import React from "react";
import ConstructionIcon from "@mui/icons-material/Construction";

function MemoComponent() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10">
        <p className="text-8xl text-violet-400 font-bold">Coming Soon.</p>
        <p className="text-3xl text-stone-600 font-semibold">Stay tuned.</p>
        <ConstructionIcon sx={{ fontSize: 160 }} color="disabled" />
      </div>
    </>
  );
}

export default MemoComponent;

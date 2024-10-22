import React from "react";
import DataArrayIcon from "@mui/icons-material/DataArray";

function EmptyData() {
  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <DataArrayIcon fontSize="large" color="warning" />
      <p className="font-bold text-2xl text-stone-800">No Data Found!</p>
    </div>
  );
}

export default EmptyData;

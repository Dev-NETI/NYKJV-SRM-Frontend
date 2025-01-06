"use client";

import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "@/lib/axios";

const TotalSupplier = () => {
  const [totalSupplier, setTotalSupplier] = React.useState(0); 

  const fetchTotalSupplier = async () => {
    try {
        console.log("Fetching total supplier count...");
        const response = await axios.get("/api/supplier/total_count");
        console.log("Response:", response);
        setTotalSupplier(response.data.total || 0);
    } catch (error) {
        console.error("Failed to fetch total suppliers:", error);
    }
};
  React.useEffect(() => {
    fetchTotalSupplier();
  }, []);

  return (
    <div className="p-4 text-center">
      <div className="font-semibold text-lg mb-4">Total Supplier</div>
      <div className="font-bold lg:text-5xl xl:text-7xl mb-4">
        {totalSupplier} {/* Display totalSupplier count */}
      </div>
      <div className="flex text-center items-center justify-center gap-2">
        <TrendingUpIcon sx={{ color: "#36bf5a" }} />
        <div className="lg:text-[10px] xl:text-xl">24% from Etibac</div>
      </div>
    </div>
  );
};

export default TotalSupplier;

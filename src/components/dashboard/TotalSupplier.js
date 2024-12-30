"use client";

import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const TotalSupplier = () => {
  return (
    <>
      <div className="">
        <div className="p-4 text-center">
          <div className="font-semibold text-lg mb-4">Total Supplier</div>
          <div className="font-bold lg:text-5xl xl:text-7xl mb-4">45</div>
          <div className="flex text-center items-center justify-center gap-2">
            <div className="">
              <TrendingUpIcon sx={{textColor: '#36bf5a'}}/>
            </div>
            <div className="lg:text-[10px] xl:text-xl">24% from Etibac</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalSupplier;

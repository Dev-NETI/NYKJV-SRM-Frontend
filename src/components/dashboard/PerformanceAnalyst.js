"use client";
import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PerformanceAnalysis = () => {
  return (
    <>
      <div className="w-full h-auto p-8">
        <div className="font-semibold text-lg p-4 border-b-[1px] border-gray-200 text-center">
          Total View Performance
        </div>
        <div className="py-10">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </div>
        <div className="text-center">
            <div className="mb-6">
                Performance of the Supplier
            </div>
            <div>
                <button>See Details</button>
            </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceAnalysis;

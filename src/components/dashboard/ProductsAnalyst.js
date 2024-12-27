"use client";

import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, valueFormatter } from "../../../src/components/dashboard/weather";

const ProductsAnalysis = () => {
  const chartSetting = {
    xAxis: [
      {
        label: "dummy data",
      },
    ],
    width: 500,
    height: 400,
  };

  return (
    <>
      <div>
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: "band", dataKey: "month" }]}
          series={[
            { dataKey: "seoul", label: "Purchased Products", valueFormatter },
          ]}
          layout="horizontal"
          {...chartSetting}
        />
      </div>
    </>
  );
};

export default ProductsAnalysis;

"use client";

import React, { useRef, useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, valueFormatter } from "../../../src/components/dashboard/weather";

const ProductsAnalysis = () => {
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(500); 

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth); 
      }
    };

    updateWidth(); 
    window.addEventListener("resize", updateWidth); 

    return () => window.removeEventListener("resize", updateWidth); 
  }, []);

  const chartSetting = {
    xAxis: [
      {
        label: "dummy data",
      },
    ],
    width: chartWidth, 
    height: 400, 
  };

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
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

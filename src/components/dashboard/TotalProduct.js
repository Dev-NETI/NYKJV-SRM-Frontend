"use client";

import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "@/lib/axios";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const TotalProduct = () => {
  const [totalProduct, setTotalProduct] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const fetchTotalProduct = async () => {
    try {
      const response = await axios.get("/api/products/total_count");
      setTotalProduct(response.data.total || 0);
      console.log("Total product count:", response.data.total);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching total count of product", error);
    }
  };

  React.useEffect(() => {
    fetchTotalProduct();
  }, []);

  return (
    <>
      {loading ? (
        <Box sx={{ width: "100%", p: 4 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} sx={{ marginTop: 2 }} />
          <Skeleton animation={false} sx={{ marginTop: 2 }} />
        </Box>
      ) : (
        <div className="">
          <div className="p-4 text-center">
            <div className="font-semibold text-lg mb-4">Total Product</div>
            <div className="font-bold lg:text-5xl xl:text-7xl mb-4">
              {totalProduct}
            </div>
            <div className="flex text-center items-center justify-center gap-2">
              <div className="">
                <TrendingUpIcon sx={{ textColor: "#36bf5a" }} />
              </div>
              <div className="lg:text-[10px] xl:text-xl">24% from Etibac</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalProduct;

"use client";
import React from "react";
import Header from "../Header";
import GraphChart from "../../../components/GraphChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import NewSupplier from "@/components/dashboard/NewSupplier";
import TotalSupplier from "@/components/dashboard/TotalSupplier";
import ProductsAnalysis from "@/components/dashboard/ProductsAnalyst";
import PerformanceAnalysis from "@/components/dashboard/PerformanceAnalyst";
function Dashboard() {
  return (
    <>
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 flex">
        <div className="w-2/3 h-auto p-4">
          <div className="flex justify-between">
            <div className="">
              <div>
                <span className="font-semibold text-lg">Overview</span>
              </div>
              <div>
                <span className="text-gray-400 text-md">
                  Track your supplier and performance strategy
                </span>
              </div>
            </div>
            <div className="h-[10px] w-auto">{/* date picker container */}</div>
          </div>
          <div className="mt-[1.5em] rounded-xl bg-[#fff] border-[1px] border-gray-300">
            <GraphChart />
          </div>
          <div className="flex mt-[1.5em] gap-4 ">
            <div className="w-1/2 h-1/2 ">
              <div className="flex gap-3">
                <div className="w-full h-1/2 flex items-center justify-center text-center rounded-xl bg-[#fff] border-[1px] border-gray-300">
                  <TotalSupplier />
                </div>
                <div className="w-full h-1/2 flex items-center justify-center text-center rounded-xl bg-[#fff] border-[1px] border-gray-300">
                  <TotalSupplier />
                </div>
              </div>
              <div className="mt-[1.5em] bg-[#fff] border-[1px] border-gray-300 rounded-xl">
                <ProductsAnalysis />
              </div>
            </div>

            <div className="w-1/2 h-auto">
              <NewSupplier />
            </div>
          </div>
        </div>
        <div className="w-1/3 h-auto p-3">
          <div className="w-full h-1/2 rounded-xl bg-[#fff] border-[1px] border-gray-300 mb-4">
            <PerformanceAnalysis />
          </div>
          <div className="w-full h-1/4 rounded-xl bg-[#fff] border-[1px] border-gray-300 mb-4"></div>
          <div className="w-full h-1/4 rounded-xl bg-[#fff] border-[1px] border-gray-300"></div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

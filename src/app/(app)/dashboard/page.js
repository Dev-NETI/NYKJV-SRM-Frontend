"use client";
import React from "react";
import Header from "../Header";
import GraphChart from "../../../components/GraphChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

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
            <div className="h-[10px] w-auto">
              {/* date picker container */}
            </div>
          </div>
          <div className="mt-[1.5em] rounded-xl bg-[#fff] border-[1px] border-gray-300">
            <GraphChart />
          </div>
          <div></div>
        </div>
        {/* Right container */}
        <div className="w-1/3 h-auto bg-green-200">d2</div>
      </div>
    </>
  );
}

export default Dashboard;

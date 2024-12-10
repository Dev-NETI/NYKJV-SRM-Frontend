"use client";
import React from "react";
import Header from "../Header";
import { Button } from "@mui/material";

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
            {loading && (
              <div className="w-full h-full">
                <Box className="w-full h-full p-[2em]">
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-center">Name</TableCell>
                  <TableCell className="text-center">Island ID</TableCell>
                  <TableCell className="text-center">Province ID</TableCell>
                  <TableCell className="text-center">Municipality ID</TableCell>
                  <TableCell className="text-center">Barangay ID</TableCell>
                  <TableCell className="text-center">Street Address</TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSuppliers.length > 0
                  ? currentSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="text-center">
                          {supplier.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.island_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.province_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.municipality_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.brgy_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.street_address}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditClick(supplier.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(supplier.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : !loading && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No suppliers available.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
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

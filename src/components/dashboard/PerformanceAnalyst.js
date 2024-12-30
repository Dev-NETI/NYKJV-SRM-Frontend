"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import Button from '@mui/material/Button';
const PerformanceAnalysis = () => {
  const pieParams = {
    height: 200,
    margin: { right: 5 },
    slotProps: { legend: { hidden: true } },
  };
  return (
    <>
      <div className="w-full h-auto p-8">
        <div className="font-semibold text-lg p-4 border-b-[1px] border-gray-200 text-center">
          Total View Performance
        </div>
        <div className="py-10">
          <Stack direction="row" width="100%" textAlign="center" spacing={2}>
            <Box flexGrow={1}>
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
                {...pieParams}
              />
            </Box>
          </Stack>
        </div>
        <div className="text-center">
          <div className="mb-6">Performance of the Supplier</div>
          <div className="">
            <Button variant="contained" size="small">See Details</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceAnalysis;

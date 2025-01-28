"use client";

import { useEffect } from "react";
import LayersIcon from "@mui/icons-material/Layers";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export default function DuplicatedNotificationComponent({ count, documents, isSupplier }) {
  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <div className="w-full flex p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg">
      <div className="flex flex-row items-center gap-4">
        <div className="bg-white p-2 rounded-full">
          <LayersIcon className="text-blue-500" />
        </div>
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold">Duplicated Documents</h4>
          <p className="text-sm">
            There should be only one document representing each document type.
          </p>
        </div>
      </div>
    </div>
  );
}
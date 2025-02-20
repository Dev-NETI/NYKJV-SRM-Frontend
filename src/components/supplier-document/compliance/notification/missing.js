"use client";

import { useEffect } from "react";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export default function MissingNotificationComponent({ count, documents, isSupplier }) {
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
    <div className="w-full flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg rounded-lg">
      <div className="flex flex-row items-center gap-4">
        <div className="bg-white p-2 rounded-full">
          <HelpIcon className="text-amber-500" />
        </div>
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold">Missing Documents</h4>
          <p className="text-sm">
            There {count !== 1 ? "are" : "is"}
            <HtmlTooltip
              title={
                <div className="flex p-2 font-bold">
                  <ul>
                    {documents.map((document) => (
                      <li key={document.id}>
                        {document.name}
                        <span className="text-red-500">*</span>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            >
              <span className="cursor-pointer font-bold text-xl border-dashed border-white border-b-2 px-1">
                {count}
              </span>
            </HtmlTooltip>
            missing document{count !== 1 ? "s" : ""}.  
            { isSupplier? (<span> Please upload all missing documents.</span>) : <span> Please contact the supplier to upload these missing documents.</span> }
          </p>
        </div>
      </div>
    </div>
  );
}
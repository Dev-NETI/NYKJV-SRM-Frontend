import React, { useState } from "react";
import ContextMenuComponent from "@/components/material-ui/ContextMenuComponent";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContextMenuItemComponent from "../ContextMenuItemComponent";
import { motion } from "framer-motion";
import { formatDate } from "@/utils";
// import FileViewer

function OrderDocumentListItemComponent({
  id,
  fileName = "fileName",
  modifiedBy = "modifiedBy",
  updatedAt = "",
  filePath = "",
  orderDocumentType = "",
  supplier = "",
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [isActionTriggered, setIsActionTriggered] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: {
      opacity: 0,
      scale: 0,
      rotate: 360,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/supplier-documents/${filePath}`}
      target="_blank"
    >
      <motion.div
        onContextMenu={handleContextMenu}
        style={{ cursor: "context-menu" }}
        initial={itemAnimation.initial}
        animate={isActionTriggered ? itemAnimation.exit : itemAnimation.animate}
        exit={itemAnimation.exit}
      >
        <div className="flex flex-col gap-2 bg-gray-100 rounded-lg hover:bg-gray-200 p-4 w-52 ">
          <div className="flex flex-row gap-4 justify-between items-center">
            <div className="overflow-hidden flex flex-row gap-2">
              <PictureAsPdfIcon fontSize="small" color="error" />
              <p className="font-semibold text-xs text-stone-800 truncate">
                {fileName}
              </p>
            </div>
            <MoreVertIcon fontSize="small" onClick={handleContextMenu} />
          </div>

          <div className="bg-white rounded-md flex justify-center items-center p-2">
            {/* <canvas
              ref={canvasRef}
              style={{ width: "100px", height: "100px" }}
            ></canvas> */}
          </div>

          <div className="flex flex-row gap-2 ">
            <p className="text-xs text-stone-500">{modifiedBy}</p>
            <p className="text-xs text-stone-500">.</p>
            <p className="text-xs text-stone-500">
              {formatDate(updatedAt, "yyyy-mm-dd")}
            </p>
          </div>
          <div className="flex">
            <p className="text-white bg-blue-700 text-xs px-2 rounded-lg">
              {orderDocumentType}
            </p>
          </div>
          <div className="flex">
            <p className="text-white bg-green-800 text-xs px-2 rounded-lg">
              {supplier}
            </p>
          </div>

          <ContextMenuComponent
            contextMenu={contextMenu}
            handleClose={handleClose}
          >
            <div>
              <ContextMenuItemComponent
                filePath={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/order-document/${filePath}`}
                label="Open"
                icon={<OpenInNewIcon fontSize="small" />}
              />
            </div>
          </ContextMenuComponent>
        </div>
      </motion.div>
    </Link>
  );
}

export default OrderDocumentListItemComponent;

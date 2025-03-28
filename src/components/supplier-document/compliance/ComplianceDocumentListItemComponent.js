import React, { useState, useContext } from "react";
import ContextMenuComponent from "../../material-ui/ContextMenuComponent";
import { useSupplierDocument } from "@/hooks/api/supplier-document";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContextMenuItemComponent from "../ContextMenuItemComponent";
import DocumentListItemFooterComponent from "../DocumentListItemFooterComponent";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/auth"

function ComplianceDocumentListItemComponent({
  id,
  fileName = "fileName",
  type = "fileName",
  modifiedBy = "modifiedBy",
  updatedAt = "",
  filePath = "",
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [isActionTriggered, setIsActionTriggered] = useState(null);
  const { patchNoPayload: moveToTrash } = useSupplierDocument("trash");
  const { patchNoPayload: recycle } = useSupplierDocument("recycle");
  const { destroy } = useSupplierDocument();
  const { user } = useAuth({middleware: "auth"})
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

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

  const handleMoveToTrash = async () => {
    const { data: response } = await moveToTrash(id);
    setSupplierDocumentState((prevState) => ({
      ...prevState,
      snackbar: true,
      snackbarMessage: response
        ? "File moved to trash successfully!"
        : "Something went wrong!",
      snackBarSeverity: response ? "success" : "error",
    }));

    setIsActionTriggered("trash");

    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
  };

  const handleRecycle = async () => {
    const { data: response } = await recycle(id);
    setSupplierDocumentState((prevState) => ({
      ...prevState,
      snackbar: true,
      snackbarMessage: response
        ? "File removed from trash!"
        : "Something went wrong!",
      snackBarSeverity: response ? "success" : "error",
    }));

    setIsActionTriggered("recycle");

    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
  };

  const handleDestroy = async () => {
    const { data: response } = await destroy(id);
    setSupplierDocumentState((prevState) => ({
      ...prevState,
      snackbar: true,
      snackbarMessage: response
        ? "File deleted forever!"
        : "Something went wrong!",
      snackBarSeverity: response ? "success" : "error",
    }));

    setIsActionTriggered("destroy");

    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
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
        <div className="flex flex-col gap-2 bg-gray-100 rounded-lg hover:bg-gray-200 p-4 w-56 max-w-56 h-56 max-h-56">
          <div className="flex flex-row gap-4 justify-between items-center">
            <div className="overflow-hidden flex flex-row gap-2">
              <PictureAsPdfIcon fontSize="small" color="error" />
              <p className="font-semibold text-xs text-stone-800 truncate">
                {type}
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

          <DocumentListItemFooterComponent label={modifiedBy} />
          <DocumentListItemFooterComponent label={updatedAt} />


          <ContextMenuComponent
            contextMenu={contextMenu}
            handleClose={handleClose}
          >
            <div>
              {supplierDocumentState.activePage === 1 ? (
                <>
                  { user?.supplier_id?
                  (<ContextMenuItemComponent
                    onClick={handleMoveToTrash}
                    label="Move to trash"
                    icon={<DeleteIcon fontSize="small" />}
                  />) : ""
                  }
                  <ContextMenuItemComponent
                    filePath={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/supplier-documents/${filePath}`}
                    label="Open"
                    icon={<OpenInNewIcon fontSize="small" />}
                  />
                </>
              ) : (
                <>
                  <ContextMenuItemComponent
                    onClick={handleRecycle}
                    label="Activate"
                    icon={<RecyclingIcon fontSize="small" />}
                  />
                  <ContextMenuItemComponent
                    onClick={handleDestroy}
                    label="Delete Forever"
                    icon={<DeleteForeverIcon fontSize="small" />}
                  />
                </>
              )}
            </div>
          </ContextMenuComponent>
        </div>
      </motion.div>
    </Link>
  );
}

export default ComplianceDocumentListItemComponent;

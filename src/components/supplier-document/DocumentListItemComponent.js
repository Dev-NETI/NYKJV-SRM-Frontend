import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import ContextMenuComponent from "../material-ui/ContextMenuComponent";
import { useSupplierDocument } from "@/hooks/api/supplier-document";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContextMenuItemComponent from "./ContextMenuItemComponent";
import DocumentListItemFooterComponent from "./DocumentListItemFooterComponent";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function DocumentListItemComponent({
  id,
  fileName = "fileName",
  modifiedBy = "modifiedBy",
  updatedAt = "",
  filePath = "",
}) {
  const canvasRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const { patchNoPayload: moveToTrash } = useSupplierDocument("trash");
  const { patchNoPayload: recycle } = useSupplierDocument("recycle");
  const { destroy } = useSupplierDocument();
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(filePath);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const desiredSize = 96;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          desiredSize / viewport.width,
          desiredSize / viewport.height
        );

        const scaledViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = desiredSize;
        canvas.width = desiredSize;

        page.render({ canvasContext: context, viewport: scaledViewport })
          .promise;
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    if (filePath) {
      loadPdf();
    }
  }, [filePath]);

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
    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
  };

  return (
    <div className="w-full h-full min-h-60">
      <Link className="w-full h-full m-0" href={filePath} target="_blank">
        <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
          <div className="flex flex-col gap-2 bg-gray-100 rounded-lg hover:bg-gray-200 p-4 w-full h-full min-h-60">
            <div className="flex flex-row gap-4 justify-between items-center">
              <div className="overflow-hidden flex flex-row gap-2">
                <PictureAsPdfIcon fontSize="small" color="error" />
                <p className="font-semibold text-xs text-stone-800 truncate">
                  {fileName}
                </p>
              </div>
              <div>
                <MoreVertIcon fontSize="small" onClick={handleContextMenu} />
              </div>
            </div>

            <div className="bg-white rounded-md flex justify-center items-center p-2">
              <canvas
                ref={canvasRef}
                style={{ width: "100px", height: "100px" }}
              ></canvas>
            </div>

            <DocumentListItemFooterComponent label={modifiedBy} />
            <DocumentListItemFooterComponent label={updatedAt} />
          </div>

          <ContextMenuComponent
            contextMenu={contextMenu}
            handleClose={handleClose}
          >
            <div>
              {supplierDocumentState.activePage === 1 ? (
                <>
                  <ContextMenuItemComponent
                    onClick={handleMoveToTrash}
                    label="Move to trash"
                    icon={<DeleteIcon fontSize="small" />}
                  />
                  <ContextMenuItemComponent
                    filePath={filePath}
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
      </Link>
    </div>
  );
}

export default DocumentListItemComponent;

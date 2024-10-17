import React, { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import ContextMenuComponent from "../material-ui/ContextMenuComponent";
import { MenuItem } from "@mui/material";
import { useSupplierDocument } from "@/hooks/api/supplier-document";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";

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
  const { setSupplierDocumentState } = useContext(SupplierDocumentContext);

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
    }));
    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
      <Link href={filePath} target="_blank">
        <Card>
          <CardContent>
            <p className="font-bold text-sm text-stone-800">{fileName}</p>
            <canvas
              ref={canvasRef}
              style={{ width: "192px", height: "192px" }}
            ></canvas>
            <p className=" text-xs italic text-stone-600">{modifiedBy}</p>
            <p className=" text-xs italic text-stone-600">{updatedAt}</p>
          </CardContent>
        </Card>
      </Link>
      <ContextMenuComponent contextMenu={contextMenu} handleClose={handleClose}>
        <MenuItem onClick={handleMoveToTrash}>Move to trash</MenuItem>
      </ContextMenuComponent>
    </div>
  );
}

export default DocumentListItemComponent;

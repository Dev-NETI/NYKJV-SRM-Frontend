"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function DocumentListMissingItemComponent({
  id,
  type,
  handleOpenFileUploadModal,
}) {
  return (
    <div
      onClick={() => handleOpenFileUploadModal(id)}
      className="w-full group hover:bg-slate-200 h-full bg-slate-100 p-0 border-dashed border-4 min-h-60 border-slate-200 rounded-lg p-4 cursor-pointer"
    >
      <div className="flex flex-col gap-4 justify-center w-full h-full items-center text-center text-sm text-stone-600">
        <CloudUploadIcon className="text-stone-400 group-hover:text-stone-600" sx={{ fontSize: 40 }} />
        {type}
      </div>
    </div>
  );
}
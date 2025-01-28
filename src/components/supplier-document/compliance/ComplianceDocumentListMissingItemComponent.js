"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState, useEffect } from 'react'
import { useAuth } from "@/hooks/auth"

export default function ComplianceDocumentListMissingItemComponent({
  id,
  type,
  handleOpenFileUploadModal,
}) {
  const [isSupplier, setIsSupplier] = useState(false);

  const { user } = useAuth({ middleware: "auth" });

  useEffect(() => {
    if(user?.supplier_id) setIsSupplier(true)
    else setIsSupplier(false)
  }, []);

  return (
    <div>
      {
        isSupplier? 
        
        (
        <div
          onClick={() => handleOpenFileUploadModal(id)}
          className="w-full group hover:bg-slate-200 w-56 max-w-56 h-full bg-slate-100 p-0 border-dashed border-4 min-h-56 max-h-56 border-slate-200 rounded-lg p-4 cursor-pointer"
        >
          <div className="flex flex-col gap-4 justify-center w-full h-full items-center text-center text-sm text-stone-600">
            <CloudUploadIcon className="text-stone-400 group-hover:text-stone-600" sx={{ fontSize: 40 }} />
            {type}
          </div>
        </div>
        )
        :
        (
        <div
          className="w-full h-full bg-slate-100 p-0 border-dashed border-4 min-h-56 border-slate-200 rounded-lg p-4 w-56 max-w-56 max-h-56 cursor-pointer"
        >
          <div className="flex flex-col gap-4 justify-center w-full h-full items-center text-center text-sm text-stone-600">
            {type}
          </div>
        </div>
        )
      }
    </div>
  );
}
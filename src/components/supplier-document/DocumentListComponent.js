import React, { useEffect, useState } from "react";
import DocumentListItemComponent from "./DocumentListItemComponent";
import { useSupplierDocument } from "@/hooks/api/supplier-document";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import TextFieldComponent from "../tailwind/TextFieldComponent";
import SearchIcon from "@mui/icons-material/Search";
import SelectComponent from "../material-ui/SelectComponent";
import { useDocumentType } from "@/hooks/api/document-type";
import { FormControl } from "@mui/material";

function DocumentListComponent() {
  const { user } = useAuth({ middleware: "auth" });
  const { showWith2Parameter: getSupplierDocument } =
    useSupplierDocument("show-documents");
  const { index: getDocumentType } = useDocumentType();
  const [documentListState, setDocumentListState] = useState({
    documentData: [],
    filteredData: [],
    documentTypeData: [],
  });
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getSupplierDocument(
        user.supplier_id,
        supplierDocumentState.activePage
      );
      const { data: documentTypeData } = await getDocumentType();
      setDocumentListState((prevState) => ({
        ...prevState,
        documentData: data,
        documentTypeData: documentTypeData,
      }));
      setSupplierDocumentState((prevState) => ({
        ...prevState,
        reload: false,
      }));
    };

    if (user) {
      supplierDocumentState.reload === true && fetchData();
    }
  }, [user, supplierDocumentState.reload]);

  const handleSearch = (value) => {
    setDocumentListState((prevState) => ({
      ...prevState,
      filteredData: documentListState.documentData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ),
    }));
  };

  return (
    <div
      className="basis-full md:basis-10/12 lg:basis-10/12
                 flex flex-col gap-4"
    >
      {/* search */}
      <div className="flex justify-center items-center">
        <div className="relative w-4/12">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <SearchIcon />
          </span>
          <TextFieldComponent
            type="text"
            className="bg-stone-100 rounded-full w-full py-3 pl-10 pr-3"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      {/* document type dropdown */}
      {documentListState.documentTypeData && (
        <div className="flex justify-center items-center">
          <div className="w-4/12 flex justify-end ">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <SelectComponent
                label="Document Type"
                data={documentListState.documentTypeData}
              />
            </FormControl>
          </div>
        </div>
      )}

      {/* document list */}
      <div
        className="rounded-xl bg-white border-gray-500
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 
      gap-4 p-4"
      >
        {documentListState.filteredData.length > 0
          ? documentListState.filteredData.map((item) => (
              <DocumentListItemComponent
                id={item.id}
                key={item.id}
                fileName={item.name}
                modifiedBy={item.modified_by}
                updatedAt={item.updated_at}
                filePath={item.file_path}
              />
            ))
          : documentListState.documentData.map((item) => (
              <DocumentListItemComponent
                id={item.id}
                key={item.id}
                fileName={item.name}
                modifiedBy={item.modified_by}
                updatedAt={item.updated_at}
                filePath={item.file_path}
              />
            ))}
      </div>
    </div>
  );
}

export default DocumentListComponent;

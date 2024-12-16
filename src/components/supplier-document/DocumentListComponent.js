import React, { useEffect, useState } from "react";
import OrderDocumentListItemComponent from "./orders/OrderDocumentListItemComponent";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import TextFieldComponent from "../tailwind/TextFieldComponent";
import SearchIcon from "@mui/icons-material/Search";
import SelectComponent from "../material-ui/SelectComponent";
import { FormControl } from "@mui/material";
import { useOrderDocument } from "@/hooks/api/order-document";
import { useOrderDocumentType } from "@/hooks/api/order-document-type";

function DocumentListComponent() {
  const { user } = useAuth({ middleware: "auth" });
  const { show: getOrderDocument } = useOrderDocument();
  const { index: getDocumentType } = useOrderDocumentType();
  const [documentListState, setDocumentListState] = useState({
    documentData: [],
    filteredData: [],
    documentTypeData: [],
    selectedDocumentType: "",
  });
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: orderDocumentData } = await getOrderDocument(14);
      const { data: documentTypeData } = await getDocumentType();
      setDocumentListState((prevState) => ({
        ...prevState,
        documentData: orderDocumentData,
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
        item.file_name.toLowerCase().includes(value.toLowerCase())
      ),
    }));
  };

  const handleDropdownChange = (value) => {
    setDocumentListState((prevState) => ({
      ...prevState,
      filteredData:
        value !== "" &&
        documentListState.documentData.filter(
          (item) => item.order_document_type_id === value
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
                value={documentListState.selectedDocumentType || ""}
                label="Document Type"
                data={documentListState.documentTypeData}
                onChange={(event) => {
                  setDocumentListState((prevState) => ({
                    ...prevState,
                    selectedDocumentType: event.target.value,
                  }));
                  handleDropdownChange(event.target.value);
                }}
              />
            </FormControl>
          </div>
        </div>
      )}

      {/* document list */}
      <div
        className="rounded-xl   
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 
      gap-4 p-2"
      >
        {documentListState.filteredData.length > 0
          ? documentListState.filteredData.map((item) => (
              <OrderDocumentListItemComponent
                id={item.id}
                key={item.id}
                fileName={item.file_name}
                modifiedBy={item.modified_by}
                updatedAt={item.updated_at}
                filePath={item.file_path}
                orderDocumentType={item?.order_document_type?.name}
                supplier={item?.supplier?.name}
              />
            ))
          : documentListState.documentData.map((item) => (
              <OrderDocumentListItemComponent
                id={item.id}
                key={item.id}
                fileName={item.file_name}
                modifiedBy={item.modified_by}
                updatedAt={item.updated_at}
                filePath={item.file_path}
                orderDocumentType={item?.order_document_type?.name}
                supplier={item?.supplier?.name}
              />
            ))}
      </div>
    </div>
  );
}

export default DocumentListComponent;

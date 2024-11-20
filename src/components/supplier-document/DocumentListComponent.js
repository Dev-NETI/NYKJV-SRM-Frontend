import React, { useEffect, useState } from "react";
import DocumentListItemComponent from "./DocumentListItemComponent";
import { Input, Space } from "antd";
const { Search } = Input;
import { useSupplierDocument } from "@/hooks/api/supplier-document";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";

function DocumentListComponent() {
  const { user } = useAuth({ middleware: "auth" });
  const { showWith2Parameter: getSupplierDocument } =
    useSupplierDocument("show-documents");
  const [documentListState, setDocumentListState] = useState({
    documentData: [],
    filteredData: [],
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
      setDocumentListState((prevState) => ({
        ...prevState,
        documentData: data,
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

  const handleSearch = (value, _e, info) => {
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
      <div className="flex justify-center items-center">
        {/* <Space direction="vertical">
          <Search
            size="large"
            placeholder="Search file here..."
            onSearch={handleSearch}
            enterButton
          />
        </Space> */}
      </div>
      <div
        className="rounded-xl bg-white border-gray-500
    grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 
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

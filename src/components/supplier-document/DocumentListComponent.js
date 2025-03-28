import React, { useEffect, useState } from "react";
import OrderDocumentListItemComponent from "./orders/OrderDocumentListItemComponent";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import TextFieldComponent from "../tailwind/TextFieldComponent";
import SearchIcon from "@mui/icons-material/Search";
import SelectComponent from "../material-ui/SelectComponent";
import { useOrderDocument } from "@/hooks/api/order-document";
import { useOrderDocumentType } from "@/hooks/api/order-document-type";
import { useDepartmentSupplier } from "@/hooks/api/department-supplier";
import DataArrayIcon from "@mui/icons-material/DataArray";
import Skeleton from "@mui/material/Skeleton";

function DocumentListComponent() {
  const { user } = useAuth({ middleware: "auth" });
  const { showWith2Parameter: getOrderDocument } =
    useOrderDocument("get-documents");
  const { index: getDocumentType } = useOrderDocumentType();
  const { show: getDepartmentSupplier } =
    useDepartmentSupplier("get-per-department");
  const [documentListState, setDocumentListState] = useState({
    documentData: [],
    filteredData: [],
    documentTypeData: [],
    departmentSupplierData: [],
    selectedDepartmentSupplier: "",
    selectedDocumentType: "",
    searchedValue: "",
  });
  const [loading, setLoading] = useState(true);
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: orderDocumentData } = await getOrderDocument(
        user.supplier_id ? user.supplier_id : "null",
        user.supplier_id ? "null" : user.department_id
      );
      const { data: documentTypeData } = await getDocumentType();
      const { data: departmentSupplierData } = await getDepartmentSupplier(
        user.department_id
      );

      setDocumentListState((prevState) => ({
        ...prevState,
        documentData: orderDocumentData,
        documentTypeData: documentTypeData,
        departmentSupplierData: user.supplier_id
          ? []
          : departmentSupplierData.map((item) => {
              return {
                id: item.supplier_id,
                name: item.supplier.name,
              };
            }),
      }));
      setSupplierDocumentState((prevState) => ({
        ...prevState,
        reload: false,
      }));
      setLoading(false);
    };

    if (user) {
      supplierDocumentState.reload === true && fetchData();
    }
  }, [
    user,
    supplierDocumentState.reload,
    getDepartmentSupplier,
    getDocumentType,
    getOrderDocument,
    setSupplierDocumentState,
  ]);

  const handleSearch = (value) => {
    setDocumentListState((prevState) => ({
      ...prevState,
      searchedValue: value,
      filteredData: documentListState.documentData.filter((item) =>
        item.file_name.toLowerCase().includes(value.toLowerCase())
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

      <div className="flex flex-row justify-center items-center gap-2">
        {/* document type dropdown */}
        {documentListState.documentTypeData && (
          <div className="flex justify-center items-center">
            <div className="w-4/12 flex justify-end ">
              <SelectComponent
                size="small"
                value={documentListState.selectedDocumentType || ""}
                label="Document Type"
                data={documentListState.documentTypeData}
                onChange={(event) => {
                  setDocumentListState((prevState) => ({
                    ...prevState,
                    selectedDocumentType: event.target.value,
                    filteredData:
                      event.target.value !== "" &&
                      documentListState.documentData.filter(
                        (item) =>
                          item.order_document_type_id === event.target.value
                      ),
                  }));
                }}
              />
            </div>
          </div>
        )}

        {/* supplier dropdown */}
        {!user?.supplier_id && (
          <div className="flex justify-center items-center">
            <div className="w-4/12 flex justify-end ">
              <SelectComponent
                size="small"
                value={documentListState.selectedDepartmentSupplier || ""}
                label="Supplier"
                data={documentListState.departmentSupplierData}
                onChange={(event) => {
                  setDocumentListState((prevState) => ({
                    ...prevState,
                    selectedDepartmentSupplier: event.target.value,
                    filteredData:
                      event.target.value !== "" &&
                      documentListState.documentData.filter(
                        (item) => item.supplier_id === event.target.value
                      ),
                  }));
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* document list */}
      <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4 p-2">
        {loading ? (
          <ListSkeleton />
        ) : (
          // Check for dropdown values
          <>
            {documentListState.selectedDocumentType === "" &&
            documentListState.selectedDepartmentSupplier === "" &&
            documentListState.searchedValue === "" ? (
              // Display original documentData when no dropdowns are selected
              documentListState.documentData.length > 0 ? (
                documentListState.documentData.map((item) => (
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
              ) : (
                <DataNotFound />
              )
            ) : // If dropdowns are selected, show filteredData
            documentListState.filteredData.length > 0 ? (
              documentListState.filteredData.map((item) => (
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
            ) : (
              <DataNotFound />
            )}
          </>
        )}
      </div>
    </div>
  );
}

const DataNotFound = () => {
  return (
    <div className="col-span-full flex flex-col gap-2 items-center justify-center mt-20">
      <div className=" text-center text-red-700 text-7xl font-bold">
        No data found.
      </div>
      <DataArrayIcon sx={{ fontSize: 140 }} color="error" />
    </div>
  );
};

const ListSkeleton = () => {
  const width = 250;
  const height = 170;
  return (
    <>
      <Skeleton variant="rectangular" width={width} height={height} />
      <Skeleton variant="rectangular" width={width} height={height} />
      <Skeleton variant="rectangular" width={width} height={height} />
      <Skeleton variant="rectangular" width={width} height={height} />
      <Skeleton variant="rectangular" width={width} height={height} />
    </>
  );
};

export default DocumentListComponent;

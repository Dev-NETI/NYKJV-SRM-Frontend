import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ComplianceDocumentListItemComponent from "./ComplianceDocumentListItemComponent";
import ComplianceDocumentListMissingItemComponent from "./ComplianceDocumentListMissingItemComponent";
import ComplianceDocumentListSupplierSelection from "./ComplianceDocumentListSupplierSelection";

import ExpiredNotificationComponent from "./notification/expired";
import WarningNotificationComponent from "./notification/warning";
import DuplicatedNotificationComponent from "./notification/duplicated";
import MissingNotificationComponent from "./notification/missing";
import CompletedNotificationComponent from "./notification/completed";

import { Input, Space } from "antd";

// Destructuring the Search component from Input
const { Search } = Input;
/******  136e3886-41c0-43b4-a758-7e6c4304f8f2  *******/
import { useSupplierDocument } from "@/hooks/api/supplier-document";
import { useAuth } from "@/hooks/auth";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import { useDocumentType } from "@/hooks/api/document-type";

export default function ComplianceDocumentListComponent({
  handleOpenFileUploadModal,
}) {
  const { user } = useAuth({ middleware: "auth" });

  const { showWith3Parameter: getSupplierComplianceDocuments } =
    useSupplierDocument("show-documents-by-category");

  const { showWith2Parameter: getMissingComplianceDocuments } =
    useSupplierDocument("missing-documents");

  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

  const { documentListCategory, setDocumentListCategory } = useContext(
    SupplierDocumentContext
  );

  const [searchText, setSearchText] = useState("");
  const [isSupplier, setIsSupplier] = useState(false);

  const [documentListState, setDocumentListState] = useState({
    documentData: [],
    filteredData: [],
  });

  const [notification, setNotification] = useState({
    expired: { count: 0 },
    warning: { count: 0 },
    duplicated: { count: 0 },
    missing: { count: 0 },
    completed: false,
  });

  const [missing, setMissing] = useState([]);
  const [expired, setExpired] = useState([]);
  const [duplicated, setDuplicated] = useState([]);
  const [warning, setWarning] = useState([]);

  const getUploadedDocuments = useCallback(
    async (supplierId, categoryId, isActive = 1) => {
      const response = await getSupplierComplianceDocuments(
        supplierId,
        categoryId,
        isActive
      );
      return response.data;
    },
    [getSupplierComplianceDocuments]
  );

  const getMissingDocuments = useCallback(
    async (supplierId, categoryId) => {
      const response = await getMissingComplianceDocuments(
        supplierId,
        categoryId
      );
      return response.data;
    },
    [getMissingComplianceDocuments]
  );

  const getExpiredDocuments = (documents = []) => {
    return documents.filter(
      (doc) => doc.expired_at && new Date(doc.expired_at) < new Date()
    );
  };

  const getWarningDocuments = (documents = []) => {
    return documents.filter((doc) => {
      if (!doc.expired_at) return false;
      const expirationDate = new Date(doc.expired_at);
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return expirationDate > new Date() && expirationDate <= oneWeekFromNow;
    });
  };

  const getDuplicatedDocuments = (documents = []) => {
    return documents.filter(
      (doc, index, self) =>
        index !==
        self.findIndex((t) => t.document_type_id === doc.document_type_id)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const COMPLIANCE_DOCUMENT_CATEGORY_ID = 1;
      const uploadedDocs = await getUploadedDocuments(
        user?.supplier_id || supplierDocumentState.supplierId,
        COMPLIANCE_DOCUMENT_CATEGORY_ID,
        supplierDocumentState.activePage
      );
      setDocumentListState((prevState) => ({
        ...prevState,
        documentData: uploadedDocs,
      }));

      const missingDocs = await getMissingDocuments(
        user?.supplier?.id || supplierDocumentState.supplierId,
        COMPLIANCE_DOCUMENT_CATEGORY_ID
      );
      setMissing(missingDocs);

      const expiredDocs = getExpiredDocuments(uploadedDocs);
      setExpired(expiredDocs);

      const warningDocs = getWarningDocuments(uploadedDocs);
      setWarning(warningDocs);

      const duplicatedDocs = getDuplicatedDocuments(uploadedDocs);
      setDuplicated(duplicatedDocs);

      setNotification((prevState) => ({
        ...prevState,
        expired: { count: expiredDocs.length },
        warning: { count: warningDocs.length },
        duplicated: { count: duplicatedDocs.length },
        missing: { count: missingDocs.length },
        completed: missingDocs.length === 0,
      }));

      setSupplierDocumentState((prevState) => ({
        ...prevState,
        reload: false,
      }));
    };

    if (user?.is_supplier) setIsSupplier(true);
    else setIsSupplier(false);

    if (user) {
      supplierDocumentState.reload === true && fetchData();
    }
  }, [
    user,
    supplierDocumentState.reload,
    getMissingDocuments,
    getUploadedDocuments,
    setSupplierDocumentState,
    supplierDocumentState.activePage,
    supplierDocumentState.supplierId,
  ]);

  const handleSearch = (value, _e, info) => {
    setSearchText(value);

    const filteredData = documentListState.documentData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setDocumentListState((prevState) => ({
      ...prevState,
      filteredData: filteredData,
    }));
  };

  return (
    <div
      className="basis-full lg:basis-full
                 flex flex-col gap-4"
    >
      <div className="flex justify-center items-center">
        <Space direction="vertical">
          <Search
            size="large"
            placeholder="Search file here..."
            onSearch={handleSearch}
            enterButton
          />
        </Space>
      </div>

      {user?.supplier_id ? (
        <></>
      ) : (
        <div className="">
          {supplierDocumentState.activePage == 1 ? (
            <ComplianceDocumentListSupplierSelection />
          ) : (
            <></>
          )}
        </div>
      )}

      {!user?.supplier_id && supplierDocumentState.supplierId == 0 ? (
        <div>Please select a supplier.</div>
      ) : (
        <div className="flex flex-col bg-white border-gray-500 rounded-xl p-4 ">
          {supplierDocumentState.activePage == 1 ? (
            <div className="flex flex-col gap-2 bg-white p-4 mb-4">
              {notification.expired.count > 0 && (
                <ExpiredNotificationComponent
                  count={notification.expired.count}
                  documents={expired}
                />
              )}

              {notification.warning.count > 0 && (
                <WarningNotificationComponent
                  count={notification.warning.count}
                  documents={warning}
                  isSupplier={user?.supplier_id}
                />
              )}

              {/* { notification.duplicated.count > 0 && <DuplicatedNotificationComponent count={notification.duplicated.count} documents={duplicated} /> } */}

              {notification.missing.count > 0 && (
                <MissingNotificationComponent
                  count={notification.missing.count}
                  documents={missing}
                  isSupplier={user?.supplier_id}
                />
              )}

              {notification.expired.count <= 0 && notification.completed && (
                <CompletedNotificationComponent
                  isSupplier={user?.supplier_id}
                />
              )}
            </div>
          ) : (
            ""
          )}
          <div className="bg-white grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {searchText.length > 0
              ? documentListState.filteredData.map((item) => (
                  <ComplianceDocumentListItemComponent
                    id={item.id}
                    key={item.id}
                    type={item?.document_type?.name}
                    fileName={item.name}
                    modifiedBy={item.modified_by}
                    updatedAt={item.updated_at}
                    filePath={item.file_path}
                  />
                ))
              : documentListState.documentData.map((item) => (
                  <ComplianceDocumentListItemComponent
                    id={item.id}
                    key={item.id}
                    type={item?.document_type?.name}
                    fileName={item.name}
                    modifiedBy={item.modified_by}
                    updatedAt={item.updated_at}
                    filePath={item.file_path}
                  />
                ))}
            {supplierDocumentState.activePage == 1 &&
              missing.length > 0 &&
              missing.map((item) => (
                <ComplianceDocumentListMissingItemComponent
                  id={item.id}
                  key={item.id}
                  type={item.name}
                  handleOpenFileUploadModal={handleOpenFileUploadModal}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import DocumentListItemComponent from "./DocumentListItemComponent";
import { Input, Space } from "antd";
const { Search } = Input;

function DocumentListComponent() {
  const handleSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <div
      className="basis-full md:basis-10/12 lg:basis-10/12
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
      <div
        className="rounded-xl bg-stone-200 border-gray-500
    grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 
    gap-4 p-4"
      >
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
        <DocumentListItemComponent />
      </div>
    </div>
  );
}

export default DocumentListComponent;

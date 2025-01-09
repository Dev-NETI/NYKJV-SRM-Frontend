"use client";
import React, { useState } from "react";
import Header from "../Header";
import TabMenu from "@/components/order/TabMenu";
import OrderList from "@/components/order/OrderList";

function Page() {
  const [orderStatusId, setOrderStatusId] = useState(1);

  const handleChange = (newValue) => {
    setOrderStatusId(newValue);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Header title="Orders" />

      <div
        className="bg-white rounded-lg shadow-md 
       md:mx-44 lg:mx-44 xl:mx-72
      "
      >
        <TabMenu handleChangeTab={handleChange} />
        <OrderList orderStatusId={orderStatusId} />
      </div>
    </div>
  );
}

export default Page;

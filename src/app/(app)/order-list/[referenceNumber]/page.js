"use client";
import React, { useState } from "react";
import Header from "../../Header";
import OrderListComponent from "@/components/order-list/OrderListComponent";
import Button from "@mui/material/Button";

function Page({ params }) {
  const [orderListState, setOrderListState] = useState({
    edit: false,
  });
  const buttonLabel = orderListState.edit ? "Cancel" : "Update";
  const buttonStyle = orderListState.edit ? "error" : "success";

  return (
    <div className="flex flex-col gap-4 p-4">
      <Header title="Order List Items" />

      <div
        className="bg-white rounded-lg shadow-md 
       md:mx-44 lg:mx-44 xl:mx-72
       flex flex-col gap-4 p-4
      "
      >
        <div className="flex justify-end">
          <Button
            variant="contained"
            color={buttonStyle}
            size="medium"
            onClick={() =>
              setOrderListState((prevState) => ({
                ...prevState,
                edit: !orderListState.edit,
              }))
            }
          >
            {buttonLabel}
          </Button>
        </div>
        <OrderListComponent
          referenceNumber={params.referenceNumber}
          editMode={orderListState.edit}
        />
      </div>
    </div>
  );
}

export default Page;

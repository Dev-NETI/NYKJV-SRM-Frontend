"use client";
import React from "react";
import OrderStepperComponent from "@/components/orders/OrderStepperComponent";
import { OrderProvider } from "@/stores/OrderContext";
import OrderContainerComponent from "@/components/orders/OrderContainerComponent";

function Page() {
  return (
    <OrderProvider>
      <div className="flex flex-col gap-4 py-10 px-64">
        <OrderStepperComponent />
        <OrderContainerComponent />
      </div>
    </OrderProvider>
  );
}

export default Page;

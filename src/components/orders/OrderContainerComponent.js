import React from "react";
import { useOrder } from "@/stores/OrderContext";

function OrderContainerComponent() {
  const { activeStepper, activeView } = useOrder();

  return (
    <div
      className="flex flex-col gap-2 
  bg-neutral-100 rounded-lg shadow-lg p-20"
    >
      {activeView}
    </div>
  );
}

export default OrderContainerComponent;

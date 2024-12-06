import { createContext, useContext, useState } from "react";
import MemoComponent from "@/components/orders/MemoComponent";
import QuotationComponentForm from "@/components/orders/QuotationComponentForm";

export const OrderContext = createContext("");

export const OrderProvider = ({ children }) => {
  const [activeStepper, setActiveStepper] = useState(0);

  let activeView;
  switch (activeStepper) {
    case 0:
      activeView = <QuotationComponentForm />;
      break;

    default:
      activeView = <MemoComponent />;
      break;
  }

  return (
    <OrderContext.Provider
      value={{ activeStepper, setActiveStepper, activeView }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

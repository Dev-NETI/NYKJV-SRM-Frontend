import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import { useOrder } from "@/hooks/api/order";
import { useAuth } from "@/hooks/auth";
import OrderListItem from "./OrderListItem";
import OrderListSkeleton from "./OrderListSkeleton";
import EmptyData from "../material-ui/EmptyData";

function OrderList({ orderStatusId }) {
  const { user } = useAuth({ middleware: "auth" });
  const { showWith2Parameter: getOrders } = useOrder("show-order-by-status");
  const [orderListState, setOrderListState] = useState({
    orderData: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getOrders(orderStatusId, user?.supplier_id);
      setOrderListState((prevState) => ({
        ...prevState,
        orderData: data,
        loading: false,
      }));
    };

    fetchData();
  }, [orderStatusId, user, getOrders]);

  if (orderListState.loading) {
    return <OrderListSkeleton />;
  }

  if (
    !orderListState.orderData ||
    !orderListState.orderData.orders ||
    orderListState.orderData.orders.length < 1
  ) {
    return <EmptyData />;
  }

  return (
    <div className="p-4">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {orderListState.orderData.orders.map((group, index) => {
          const requestedBy = group.orders[0].created_by;
          const createdAt = new Date(
            group.orders[0].created_at
          ).toLocaleDateString();

          return (
            <OrderListItem
              key={index}
              referenceNumber={group.reference_number}
              requestedBy={requestedBy}
              createdAt={createdAt}
            />
          );
        })}
      </List>
    </div>
  );
}

export default OrderList;

import { actionUpdateOrderStatus } from "@/modules/order.management/actions/actionUpdateOrderStatus";
import { TOrder } from "@/modules/order.management/schemas/orderSchema";
import { SyntheticEvent, useOptimistic, useState, useTransition } from "react";

export default function useOrderShow({ order }: { order: TOrder }) {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    orderStatus,
    (currentState, optimisticValue) => optimisticValue as string,
  );
  const [isPending, startTransition] = useTransition();
  const handleOrderStatusChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const updatedStatus = e.currentTarget.value;

    startTransition(async () => {
      setOptimisticStatus(updatedStatus);
      try {
        const result = await actionUpdateOrderStatus(order.uuid, updatedStatus);
        if (result.error) {
          console.error("Error updating status:", result.error);
        } else {
          setOrderStatus(result.status);
        }
      } catch (error) {
        console.error(
          "Mock server error (should not happen in this version):",
          error,
        );
      }
    });
  };
  return {
    optimisticStatus,
    isPending,
    handleOrderStatusChange,
  };
}

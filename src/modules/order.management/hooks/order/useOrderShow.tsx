import {
  actionGetOrderStatuses,
  TOrderStatusOption,
} from "@/modules/order.management/actions/actionGetOrderStatuses";
import { actionUpdateOrderStatus } from "@/modules/order.management/actions/actionUpdateOrderStatus";
import { TOrder } from "@/modules/order.management/schemas/orderSchema";
import {
  SyntheticEvent,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";

export default function useOrderShow({
  order,
  canManageWholeOrder,
}: {
  order: TOrder;
  canManageWholeOrder: boolean;
}) {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [statusOptions, setStatusOptions] = useState<TOrderStatusOption[]>([]);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    orderStatus,
    (currentState, optimisticValue) => optimisticValue as string,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!canManageWholeOrder) {
      return;
    }

    startTransition(async () => {
      const result = await actionGetOrderStatuses();
      if ("error" in result || !Array.isArray(result) || !result.length) {
        return;
      }
      setStatusOptions(result);
    });
  }, [canManageWholeOrder]);

  const handleOrderStatusChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const updatedStatus = e.currentTarget.value;
    const note = e.currentTarget.dataset.note;

    startTransition(async () => {
      setOptimisticStatus(updatedStatus);
      try {
        const result = await actionUpdateOrderStatus(
          order.uuid,
          updatedStatus,
          note,
        );
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
    statusOptions,
    handleOrderStatusChange,
  };
}

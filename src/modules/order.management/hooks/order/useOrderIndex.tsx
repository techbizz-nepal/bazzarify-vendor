import { actionUpdateOrderStatus } from "@/modules/order.management/actions/actionUpdateOrderStatus";
import {
  actionGetOrderStatuses,
  TOrderStatusOption,
} from "@/modules/order.management/actions/actionGetOrderStatuses";
import { TQueryParams } from "@/modules/core/domain/schemas/QueryParams";
import { OrderResponse } from "@/modules/core/types/dynamicTable";
import appendQueryParams from "@/modules/core/utils/dynamicTable/appendQueryParams";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { useEffect, useState, useTransition } from "react";

export default function useOrderIndex() {
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null,
  );
  const [statusOptions, setStatusOptions] = useState<TOrderStatusOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isUpdatingStatus, startUpdateTransition] = useTransition();
  const [queryParams, setQueryParams] = useState<TQueryParams>({
    filters: {
      payment_method: "null",
      status: "null",
      from: "null",
      to: "null",
    },
    page: 1,
  });
  useEffect(() => {
    submitToApi(appendQueryParams(new FormData(), queryParams)).then(
      () => undefined,
    );
  }, [queryParams]);
  useEffect(() => {
    startTransition(async () => {
      const result = await actionGetOrderStatuses();
      if ("error" in result || !Array.isArray(result) || !result.length) {
        return;
      }
      setStatusOptions(result);
    });
  }, []);
  const handleFilterSubmit = async () => {
    await submitToApi(appendQueryParams(new FormData(), queryParams));
  };
  const handleNextPage = async () => {
    const updateParams = {
      ...queryParams,
      page: queryParams.page + 1,
    };
    setQueryParams(updateParams);
  };
  const handlePrevPage = async () => {
    const updateParams = {
      ...queryParams,
      page: queryParams.page - 1,
    };
    setQueryParams(updateParams);
  };
  async function submitToApi(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await actionGetOrders(formData);
        if (result.error) {
          console.error("Error fetching orders:", result.error);
        } else {
          setOrderResponse(result.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    });
  }
  const handleRowOrderStatusChange = async (
    orderUuid: string,
    statusCode: string,
    statusLabel: string,
  ) => {
    startUpdateTransition(async () => {
      const result = await actionUpdateOrderStatus(
        orderUuid,
        statusCode,
        `Order marked as ${statusLabel.toLowerCase()} by vendor.`,
      );
      if ("error" in result) {
        console.error("Error updating order status:", result.error);
        return;
      }
      await submitToApi(appendQueryParams(new FormData(), queryParams));
    });
  };
  return {
    orderResponse,
    isPending,
    isUpdatingStatus,
    statusOptions,
    handleRowOrderStatusChange,
    handleFilterSubmit,
    setQueryParams,
    queryParams,
    handleNextPage,
    handlePrevPage,
  };
}

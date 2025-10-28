import { IFilters, OrderResponse } from "@/modules/core/types/dynamicTable";
import appendQueryParams from "@/modules/core/utils/dynamicTable/appendQueryParams";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { useEffect, useState, useTransition } from "react";

interface IQueryParams {
  filters: IFilters;
  page: number;
}
export default function useOrderIndex() {
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [queryParams, setQueryParams] = useState<IQueryParams>({
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
  return {
    orderResponse,
    isPending,
    handleFilterSubmit,
    setQueryParams,
    queryParams,
    handleNextPage,
    handlePrevPage,
  };
}

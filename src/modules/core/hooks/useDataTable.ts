import { ChangeEvent, useEffect, useState } from "react";
import { IApiResponse, TURLSearchParams } from "@/modules/core";
import { IPaginatedData } from "@/modules/product.management";

export default function useDataTable<
  IEntity,
  IPayload extends Record<string, unknown>,
>(
  getAction: (
    urlSearchParams: TURLSearchParams,
  ) => Promise<IApiResponse<IPayload>>,
  payloadKey: keyof IPayload,
) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<IPaginatedData<IEntity[]> | null>(null);
  const [rowsCount, setRowsCount] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [onlyLastChildren, setOnlyLastChildren] = useState(false);
  useEffect(() => {
    getAction({
      perPage: 15,
      filter: filterValue,
      page,
      with: ["parent", "children"],
      onlyLastChildren,
    })
      .then((result) => {
        if (result?.data?.message) {
          const payload = result.data.payload;
          const totalCount = payload["totalCount"] as number;
          const paginatedData = payload[payloadKey] as
            | IPaginatedData<IEntity[]>
            | undefined;

          if (totalCount) {
            setRowsCount(totalCount);
          }
          if (paginatedData) {
            setRows(paginatedData);
          }
          console.log("category", paginatedData?.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [page, payloadKey, filterValue, onlyLastChildren]);
  return {
    page,
    rows,
    rowsCount,
    filterValue,
    handleNextPage: () => setPage((prev) => prev + 1),
    handlePreviousPage: () => setPage((prev) => Math.max(prev - 1, 1)),
    handleFilterChange: (event: ChangeEvent<HTMLInputElement>) =>
      setFilterValue(event.target.value),
    handleOnlyLastChildrenFilter: () => setOnlyLastChildren(!onlyLastChildren),
  };
}

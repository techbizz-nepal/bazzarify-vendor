import { ChangeEvent, useEffect, useState } from "react";
import { IApiResponse, TURLSearchParams } from "@/modules/core";
import { IPaginatedData } from "@/modules/product.management";
import { useRouter } from "next/navigation";

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
  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [subChildOnly, setSubChildOnly] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getAction({
      perPage: "15",
      filter: filter,
      page,
      include: "parent,children",
      subChildOnly,
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
  }, [page, payloadKey, filter, subChildOnly, getAction]);
  return {
    page,
    rows,
    rowsCount,
    filter,
    handleNextPage: () => setPage((prev) => prev + 1),
    handlePreviousPage: () => setPage((prev) => Math.max(prev - 1, 1)),
    handleFilterChange: (event: ChangeEvent<HTMLInputElement>) =>
      setFilter({ [event.target.name]: event.target.value }),
    handleOnlyLastChildrenFilter: () => setSubChildOnly(!subChildOnly),
    handleViewAction: (slug: string) =>
      router.push("/categories/".concat(slug).concat("/view")),
    handleEditAction: (slug: string) =>
      router.push("/categories/".concat(slug).concat("/edit")),
  };
}

import {
  Entity,
  SimplePaginationMeta,
  UseDataTableControllerOptions,
} from "@/modules/core";
import { buildFetchParams } from "@/modules/core/lib/utils.index";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useDataTableController({
  entityKey,
  fetchAction,
}: UseDataTableControllerOptions) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<SimplePaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity>({
    uuid: "",
    slug: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchAction(
          buildFetchParams({ search, page, filters }),
        );
        if (res === null) {
          toast.error("Error fetching data");
          return;
        }
        if ("error" in res) {
          return false;
        }

        const payload = res[entityKey];

        if (payload && "data" in payload) {
          setData(payload.data || []);
          setMeta({
            current_page: payload.current_page,
            next_page_url: payload.next_page_url,
            prev_page_url: payload.prev_page_url,
          });
        } else {
          setData([payload]);
          setMeta(undefined);
        }
      } catch (error) {
        console.error(error);
        setData([]);
        setMeta(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchData().then(() => undefined);
  }, [search, page, filters, fetchAction, entityKey]);

  const onSearchChange = () => {
    const value = searchInputRef.current?.value;
    if (!value) {
      return;
    }
    setSearch(value);
    setPage(1);
  };

  const onPageChange = (direction: "next" | "prev") => {
    if (direction === "next" && meta?.next_page_url) {
      setPage((prev) => (prev || 1) + 1);
    } else if (direction === "prev" && meta?.prev_page_url && (page || 1) > 1) {
      setPage((prev) => Math.max((prev || 1) - 1, 1));
    }
  };

  const onFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };
  const onFilterClear = (key: string) => {
    setFilters((prev) => {
      const updatedFilters: Record<string, string> = {};
      Object.keys(prev).forEach((k) => {
        if (k !== key) {
          updatedFilters[k] = prev[k];
        }
      });
      return updatedFilters;
    });
    setPage(1);
  };

  const onView = (item: Entity) => {
    router.push(`/${entityKey}/${item.slug || item.uuid}/view`);
  };

  const onEdit = (item: Entity) => {
    const identifier =
      entityKey === "products" ? item.uuid : item.slug || item.uuid;

    router.push(`/${entityKey}/${identifier}/edit`);
  };

  const onDelete = (item: Entity) => {
    console.log("Delete action triggered for uuid:", item.slug || item.uuid);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem);
      setOpenDialog(false);
    }
  };

  const handleSelectItem = (item: Entity) => {
    setSelectedItem(item);
  };
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string): string => {
    const parts = path.split(".");
    let value = obj;

    for (const part of parts) {
      if (Array.isArray(value)) {
        const arrayValues = value
          .map((v) =>
            v && typeof v === "object" && part in v ? v[part] : null,
          )
          .filter(Boolean);
        const displayValues = arrayValues.slice(0, 3);
        const remainingCount = arrayValues.length - displayValues.length;
        return (
          [
            ...displayValues,
            ...(remainingCount > 0 ? [`+${remainingCount} more`] : []),
          ].join(", ") || "-"
        );
      }
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return "-";
      }
    }

    return typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
      ? String(value)
      : "-";
  };
  return {
    data,
    search,
    page,
    meta,
    loading,
    filters,
    openDialog,
    searchInputRef,
    onSearchChange,
    onPageChange,
    onFilterChange,
    handleSelectItem,
    onView,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleOpenDialog,
    getNestedValue,
    onFilterClear,
  };
}

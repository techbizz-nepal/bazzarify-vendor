import {
  Entity,
  SimplePaginationMeta,
  UseDataTableControllerOptions,
} from "@/modules/core";
import { buildFetchParams } from "@/modules/core/lib/utils.index";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useDataTableController({
  entityKey,
  fetchAction,
}: UseDataTableControllerOptions) {
  const router = useRouter();

  const [data, setData] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<SimplePaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity>({
    uuid: "",
    slug: "",
  });
  useEffect(() => {
    fetchData();
  }, [search, page, activeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchAction(
        buildFetchParams({ search, page, activeFilter }),
      );
      const payload = res.data.payload[entityKey];

      if (payload && "data" in payload) {
        setData(payload.data || []);
        setMeta(payload.meta);
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

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onPageChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setPage((p) => p + 1);
    } else if (direction === "prev") {
      setPage((p) => Math.max(p - 1, 1));
    }
  };

  const onFilterChange = (value: string) => {
    setActiveFilter(value);
    setPage(1);
  };

  const onView = (item: Entity) => {
    router.push(`/${entityKey}/${item.slug}/view`);
  };

  const onEdit = (item: Entity) => {
    router.push(`/${entityKey}/${item.slug}/edit`);
  };

  const onDelete = (item: Entity) => {
    console.log("Delete action triggered for uuid:", item.slug);
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

  return {
    data,
    search,
    page,
    meta,
    loading,
    activeFilter,
    openDialog,
    onSearchChange,
    onPageChange,
    onFilterChange,
    handleSelectItem,
    onView,
    onEdit,
    onDelete,
    handleConfirmDelete,
    handleOpenDialog,
  };
}

import { toTitleCase } from "@/modules/core/utils";
import { TOrderItem } from "@/modules/order.management/schemas/orderSchema";

interface Props {
  item: TOrderItem;
  className?: string;
}
const ItemCell = ({ item, className }: Props) => {
  const optionAttributes = JSON.parse(item.variant_attributes || "{}");
  const options = optionAttributes.length ? (
    <p>
      {Object.entries(optionAttributes)
        .map(([key, value]) => `${toTitleCase(key)}: ${value}`)
        .join(", ")}
    </p>
  ) : null;
  const vendor = item.vendor ? <p>Vendor: {item.vendor.name}</p> : null;
  return (
    <div className={className}>
      <p className="font-semibold">{item.name}</p>
      {options}
      {vendor}
    </div>
  );
};
export default ItemCell;

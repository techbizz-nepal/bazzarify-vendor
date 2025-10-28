import { FieldLegend, FieldSet } from "@/components/ui/field";

export default function DateFilter({
                                     label,
                                     fromValue,
                                     toValue,
                                     onFromChange,
                                     onToChange,
                                   }: {
  label: string;
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <FieldSet className="flex flex-row text-center">
      <FieldLegend className="block text-sm font-medium">{label}</FieldLegend>
      <div className="flex flex-row space-x-2 justify-items-center items-center">
        <label>From</label>
        <input
          type="date"
          id="from"
          name="filter[placed_at][]"
          value={fromValue}
          onChange={(e) => onFromChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <br />
        <label>To</label>
        <input
          type="date"
          id="to"
          name="filter[placed_at][]"
          value={toValue}
          onChange={(e) => onToChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </FieldSet>
  );
}
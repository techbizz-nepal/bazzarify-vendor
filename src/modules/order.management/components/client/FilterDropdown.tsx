import { FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterDropdown({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { id: string; label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldSet className="flex flex-col items-center">
      <FieldLabel htmlFor={id} className="block text-sm font-medium">
        {label}
      </FieldLabel>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/*<Select*/}
      {/*  name={`filter[${id}]`}*/}
      {/*  value={value}*/}
      {/*  onChange={onChange}*/}
      {/*  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
      {/*>*/}
      {/*  {options.map((option) => (*/}
      {/*    <option key={option.id} value={option.value}>*/}
      {/*      {option.label}*/}
      {/*    </option>*/}
      {/*  ))}*/}
      {/*</Select>*/}
    </FieldSet>
  );
}

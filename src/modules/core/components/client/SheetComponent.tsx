import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

interface SheetComponentProps {
  triggerTitle: string;
  children: ReactNode;
  sheetTitle: string;
  description: string;
  action: {
    affirmativeTitle: string;
    negativeTitle: string;
    callback: () => void;
  };
}
const SheetComponent = ({
  action,
  sheetTitle,
  children,
  description,
  triggerTitle,
}: SheetComponentProps) => {
  const { negativeTitle, affirmativeTitle, callback } = action;
  return (
    <Sheet>
      <SheetTrigger>{triggerTitle}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          <Button type="submit" onClick={callback}>
            {affirmativeTitle}
          </Button>
          <SheetClose asChild>
            <Button variant="destructive">{negativeTitle}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default SheetComponent;

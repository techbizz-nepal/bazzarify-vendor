"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actionDeleteSlider } from "@/modules/marketing/domain/slider/actions/actionDeleteSlider";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SliderDeleteScreen() {
  const { uuid } = useParams();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const closeToSliderList = () => {
    setDialogOpen(false);
    router.push("/sliders");
  };

  const handleDelete = (sliderUuid: string | undefined) => {
    if (!sliderUuid) {
      toast.error("Slider id is missing.");
      closeToSliderList();
      return;
    }

    startTransition(() => {
      void actionDeleteSlider(sliderUuid).then((result) => {
        if (result && typeof result === "object" && "error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success("Slider moved to trash.");
        closeToSliderList();
      });
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={closeToSliderList}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Slider To Trash</DialogTitle>
          <DialogDescription>
            This action soft deletes the slider. It will be hidden from active
            listings but remains recoverable through backend data.
          </DialogDescription>
        </DialogHeader>
        <div className="w-auto h-auto grid gap-4">
          <div className="text-md font-bold text-destructive">
            Are you sure you want to move this slider to trash?
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete(uuid?.toString())}
            type="button"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? "Moving..." : "Move to Trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

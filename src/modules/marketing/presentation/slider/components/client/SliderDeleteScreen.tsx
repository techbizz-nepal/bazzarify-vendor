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
import { TSliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  slider: TSliderWithImages;
}
export default function SliderDeleteScreen() {
  const { uuid } = useParams();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDelete = (uuid: string | undefined) => {
    if (!uuid) return;
    actionDeleteSlider(uuid)
      .then((r) => {
        setDialogOpen(false);
        router.back();
      })
      .catch((err) => {
        setDialogOpen(false);
        router.back();
      });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-auto h-auto grid gap-4">
          <div className="text-md font-bold text-destructive">
            Are you sure?
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-800"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={() => handleDelete(uuid?.toString())} type="button">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

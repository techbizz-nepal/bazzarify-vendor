import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <ThemedButton variant="outline" onClick={onCancel}>
            Cancel
          </ThemedButton>
          <ThemedButton variant="destructive" onClick={onConfirm}>
            Confirm
          </ThemedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

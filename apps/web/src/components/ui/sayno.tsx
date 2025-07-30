import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { handleDialogResult } from "@/lib/sayno";

interface DialogState {
  open: boolean;
  options: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
  };
  resolve: ((value: boolean) => void) | null;
}

const Sayno = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    options: {},
    resolve: null
  });

  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      setDialogState(event.detail);
    };

    window.addEventListener('sayno-update', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('sayno-update', handleUpdate as EventListener);
    };
  }, []);

  const {
    title = 'Confirm',
    description = 'Are you sure you want to continue?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default'
  } = dialogState.options;

  const handleConfirm = () => {
    handleDialogResult(true);
  };

  const handleCancel = () => {
    handleDialogResult(false);
  };

  return (
    <Dialog open={dialogState.open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export { Sayno };

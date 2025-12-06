import type { NotificationProvider } from "@bunstack/shared/database/types/notification-providers";

import { useMemo } from "react";

import DiscordForm from "./forms/discord";
import TelegramForm from "./forms/telegram";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@bunstack/react/components/dialog";
import { NotificationProviderType } from "@bunstack/shared/database/types/notification-providers";

type EditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  provider: NotificationProvider | null;
};

export default function EditForm({ open, setOpen, provider }: EditFormProps) {
  const providerFields = useMemo(() => {
    if (!provider)
      return null;

    switch (provider.type) {
      case NotificationProviderType.DISCORD:
        return (
          <DiscordForm
            setOpen={setOpen}
            initialValues={provider}
          />
        );
      case NotificationProviderType.TELEGRAM:
        return (
          <TelegramForm
            setOpen={setOpen}
            initialValues={provider}
          />
        );
      default:
        return null;
    }
  }, [provider, setOpen]);

  if (!provider)
    return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Notification Provider</DialogTitle>
        </DialogHeader>
        {providerFields}
      </DialogContent>
    </Dialog>
  );
}

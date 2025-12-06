import type { updateTelegramProviderSchema } from "@bunstack/shared/database/types/notification-providers";
import type { z } from "zod";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@bunstack/react/components/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@bunstack/react/components/field";
import { Input } from "@bunstack/react/components/input";
import { Spinner } from "@bunstack/react/components/spinner";
import { api } from "@bunstack/react/lib/http";
import { queryClient } from "@bunstack/react/lib/query-client";
import sayno from "@bunstack/react/lib/sayno";
import { insertTelegramProviderSchema, NotificationProviderType } from "@bunstack/shared/database/types/notification-providers";

type TelegramFormProps = {
  setOpen: (open: boolean) => void;
  initialValues?: z.infer<typeof updateTelegramProviderSchema> & { id: string };
};

export default function TelegramForm({ setOpen, initialValues }: TelegramFormProps) {
  const mode = initialValues ? "update" : "create";
  const providerId = initialValues?.id;

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof insertTelegramProviderSchema>) => {
      const res = await api.notifications.telegram.$post({
        json: values,
      });

      if (!res.ok) {
        throw new Error("Failed to create telegram provider");
      }

      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });

      return true;
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Telegram provider created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create telegram provider");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof updateTelegramProviderSchema>) => {
      const res = await api.notifications.telegram[":id"].$put({
        json: values,
        param: { id: providerId as string },
      });

      if (!res.ok) {
        throw new Error("Failed to update telegram provider");
      }

      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });
      return true;
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Telegram provider updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update telegram provider");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const confirmation = await sayno({
        title: "Delete Telegram Provider",
        description: "Are you sure you want to delete this telegram provider?",
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (!confirmation) {
        return false;
      }

      const res = await api.notifications.telegram[":id"].$delete({
        param: { id: providerId as string },
      });

      if (!res.ok) {
        throw new Error("Failed to delete telegram provider");
      }

      return true;
    },
    onSuccess: (deleted) => {
      if (deleted) {
        setOpen(false);
        toast.success("Telegram provider deleted successfully");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete telegram provider");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });
    },
  });

  const form = useForm({
    defaultValues: {
      // Common fields
      name: initialValues?.name ?? "",
      type: NotificationProviderType.TELEGRAM,
      // Telegram fields
      botToken: initialValues?.botToken ?? "",
      chatId: initialValues?.chatId ?? "",
      threadId: initialValues?.threadId ?? null,
    } as z.infer<typeof insertTelegramProviderSchema>,
    validators: {
      onChange: insertTelegramProviderSchema,
    },
    onSubmit: ({ value }) => {
      const mutate = mode === "create"
        ? createMutation.mutate
        : updateMutation.mutate;

      mutate(value);
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await api.notifications.telegram.test.$post({
        json: {
          botToken: form.state.values.botToken,
          chatId: form.state.values.chatId,
          threadId: form.state.values.threadId,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to test telegram provider");
      }

      return true;
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to test notification");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Telegram Bot"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="botToken"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bot Token</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="chatId"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Chat ID</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="1234567890"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="threadId"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Message Thread ID</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="1234567890"
                  autoComplete="off"
                />
                <FieldDescription>Optional. Use it when you want to send notifications to a specific topic in a group.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Subscribe
          selector={state => [state.isValid, state.isSubmitting]}
          children={([isValid, isSubmitting]) => {
            return (
              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => testMutation.mutate()}>
                  {testMutation.isPending
                    ? (
                        <span className="flex items-center gap-2">
                          <Spinner />
                          Testing...
                        </span>
                      )
                    : "Test Notification"}
                </Button>
                <div className="flex items-center gap-2">
                  {mode === "update" && (
                    <Button variant="ghost" className="hover:bg-destructive/10 hover:text-destructive transition-colors" type="button" onClick={() => deleteMutation.mutate()}>
                      {deleteMutation.isPending
                        ? (
                            <span className="flex items-center gap-2">
                              <Spinner />
                              Deleting...
                            </span>
                          )
                        : "Delete"}
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting || !isValid}>
                    {isSubmitting
                      ? (
                          <span className="flex items-center gap-2">
                            <Spinner />
                            Submitting...
                          </span>
                        )
                      : "Submit"}
                  </Button>
                </div>
              </div>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}

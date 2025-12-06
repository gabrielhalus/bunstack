import type { updateDiscordProviderSchema } from "@bunstack/shared/database/types/notification-providers";
import type { z } from "zod";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@bunstack/react/components/button";
import { Card } from "@bunstack/react/components/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@bunstack/react/components/field";
import { Input } from "@bunstack/react/components/input";
import { Spinner } from "@bunstack/react/components/spinner";
import { Switch } from "@bunstack/react/components/switch";
import { api } from "@bunstack/react/lib/http";
import { queryClient } from "@bunstack/react/lib/query-client";
import sayno from "@bunstack/react/lib/sayno";
import { insertDiscordProviderSchema, NotificationProviderType } from "@bunstack/shared/database/types/notification-providers";

type DiscordFormProps = {
  setOpen: (open: boolean) => void;
  initialValues?: z.infer<typeof updateDiscordProviderSchema> & { id: string };
};

export default function DiscordForm({ setOpen, initialValues }: DiscordFormProps) {
  const mode = initialValues ? "update" : "create";
  const providerId = initialValues?.id;

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof insertDiscordProviderSchema>) => {
      const res = await api.notifications.discord.$post({
        json: values,
      });

      if (!res.ok) {
        throw new Error("Failed to create discord provider");
      }

      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });
      return true;
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Discord provider created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create discord provider");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof updateDiscordProviderSchema>) => {
      const res = await api.notifications.discord[":id"].$put({
        json: values,
        param: { id: providerId as string },
      });

      if (!res.ok) {
        throw new Error("Failed to update discord provider");
      }

      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });
      return true;
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Discord provider updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update discord provider");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const confirmation = await sayno({
        title: "Delete Discord Provider",
        description: "Are you sure you want to delete this discord provider?",
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (!confirmation) {
        return false;
      }

      const res = await api.notifications.discord[":id"].$delete({
        param: { id: providerId as string },
      });

      if (!res.ok) {
        throw new Error("Failed to delete discord provider");
      }

      return true;
    },
    onSuccess: (deleted) => {
      if (deleted) {
        setOpen(false);
        toast.success("Discord provider deleted successfully");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete discord provider");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notification-providers-paginated"] });
    },
  });

  const form = useForm({
    defaultValues: {
      // Common fields
      name: initialValues?.name ?? "",
      type: NotificationProviderType.DISCORD,
      // Discord fields
      webhookUrl: initialValues?.webhookUrl ?? "",
      decorations: initialValues?.decorations ?? true,
    } as z.infer<typeof insertDiscordProviderSchema>,
    validators: {
      onChange: insertDiscordProviderSchema,
    },
    onSubmit: ({ value }) => {
      const mutate = mode === "create"
        ? createMutation.mutate
        : updateMutation.mutate;

      mutate(value);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await api.notifications.discord.test.$post({
        json: {
          webhookUrl: form.state.values.webhookUrl,
          decorations: form.state.values.decorations,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to test notification");
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
                  placeholder="Discord Bot"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="webhookUrl"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Webhook URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="decorations"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <Card className="flex-row justify-between items-center p-4">
                  <div className="flex flex-col gap-1">
                    <FieldLabel htmlFor={field.name}>Decorations</FieldLabel>
                    <FieldDescription>
                      Sends notifications as Discord embedded messages.
                    </FieldDescription>
                  </div>
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={checked => field.handleChange(checked)}
                    aria-invalid={isInvalid}
                  />
                </Card>
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
                <Button variant="outline" type="button" onClick={() => testMutation.mutate()} disabled={testMutation.isPending}>
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

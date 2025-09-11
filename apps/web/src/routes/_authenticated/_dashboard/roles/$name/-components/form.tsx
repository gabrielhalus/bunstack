import type { Role } from "@bunstack/shared/db/types/roles";

import { updateRoleSchema } from "@bunstack/shared/db/types/roles";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRole } from "@/lib/api/roles";
import { getAllRolesQueryOptions } from "@/lib/queries/roles";

export function Form() {
  const queryClient = useQueryClient();
  const { role } = useLoaderData({ from: "/_authenticated/_dashboard/roles/$name" });

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Role> }) => updateRole(id, data),
    onSuccess: (data) => {
      toast.success("Role successfully updated");
      queryClient.setQueryData(getAllRolesQueryOptions.queryKey, (queryData) => {
        if (!queryData?.roles)
          return queryData;

        return {
          ...queryData,
          roles: queryData.roles.map(role =>
            role.id === data.role.id
              ? { ...role, ...data.role, members: role.members }
              : role,
          ),
        };
      });
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const form = useForm({
    validators: {
      onChange: updateRoleSchema,
    },
    defaultValues: {
      label: role.label,
      description: role.description,
    },
    onSubmit: async ({ value }) => mutation.mutate({ id: role.id, data: value }),
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit(e);
    }}
    >
      <div className="grid gap-6">
        <div className="grid gap-3">
          <form.Field
            name="label"
            children={field => (
              <>
                <Label htmlFor={field.name}>Label</Label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  type="label"
                  placeholder="Role"
                  required
                />
                {field.state.meta.isTouched && !field.state.meta.isValid
                  ? (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )
                  : null}
              </>
            )}
          />
        </div>
        <div className="grid gap-3">
          <form.Field
            name="description"
            children={field => (
              <>
                <Label htmlFor={field.name}>Description</Label>
                <Input
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="Role"
                  required
                />
                {field.state.meta.isTouched && !field.state.meta.isValid
                  ? (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )
                  : null}
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting, state.isDefaultValue]}
          children={([canSubmit, isSubmitting, isDefaultValue]) => (
            <>
              <Button type="submit" disabled={!canSubmit || isDefaultValue}>
                { isSubmitting
                  ? (
                      <span className="flex items-center space-x-2">
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </span>
                    )
                  : isDefaultValue ? (<span>No changes to save</span>) : (<span>Save changes</span>) }
              </Button>
            </>
          )}
        />
      </div>
    </form>
  );
}

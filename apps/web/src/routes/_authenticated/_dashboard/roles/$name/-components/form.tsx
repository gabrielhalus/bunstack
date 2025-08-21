import type { Role, RoleWithMembers } from "@bunstack/shared/db/types/roles";

import { updateRoleSchema } from "@bunstack/shared/db/types/roles";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRole } from "@/lib/api/roles";
import { getAllRolesQueryOptions } from "@/lib/queries/roles";

export function Form({ role }: { role: RoleWithMembers }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Role> }) => updateRole(id, data),
    onSuccess: (updatedRole) => {
      toast.success("Role successfully updated");
      queryClient.setQueryData(getAllRolesQueryOptions.queryKey, (existingRoles) => {
        if (!existingRoles)
          return;

        return existingRoles.map(role =>
          role.id === updatedRole.id
            ? { ...role, ...updatedRole, members: role.members }
            : role,
        );
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
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting
                  ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        {" "}
                        Saving...
                      </span>
                    )
                  : "Save"}
              </Button>
            </>
          )}
        />
      </div>
    </form>
  );
}

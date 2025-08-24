import { createFileRoute } from "@tanstack/react-router";

import { Form } from "./-components/form";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/$name/")({
  component: RoleDetails,
});

function RoleDetails() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Role Information</h1>
        <p className="text-muted-foreground">You can view and update this role&apos;s details here.</p>
      </div>
      <Form />
    </div>
  );
}

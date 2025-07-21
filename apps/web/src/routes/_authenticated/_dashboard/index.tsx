import { usePermissionWithAuth } from "@/hooks/use-permissions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { allowed, loading } = usePermissionWithAuth("view:self")

  if (loading) {
    return <div>loading...</div>;
  }
  
  return <div>{allowed ? "allowed" : "not allowed"}</div>;
}

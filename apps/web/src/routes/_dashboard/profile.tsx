import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/profile")({
  loader: () => ({
    crumb: "pages.profile.title",
  }),
  component: Profile,
});

function Profile() {
  return <div>Hello "/_dashboard/profile"!</div>;
}

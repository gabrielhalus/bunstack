import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_dashboard/settings/$section',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { section } = Route.useParams();
  return <div>Hello "/_authenticated/_dashboard/settings/{section}"!</div>
}

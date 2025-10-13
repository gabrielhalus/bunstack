import "@bunstack/react/styles/globals.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
    routeMeta: {
      breadcrumb?: string | ((match: any) => string);
    };
  }
}

async function bootstrap() {
  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

bootstrap();

import "@bunstack/ui/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import i18n from "@/i18n";
import { routeTree } from "@/routeTree.gen";
import { Sayno } from "@bunstack/ui/components/sayno";
import { Toaster } from "@bunstack/ui/components/sonner";

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: { queryClient },
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
  await i18n.init();

  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" />
        <Sayno />
      </QueryClientProvider>
    </StrictMode>,
  );
}

bootstrap();

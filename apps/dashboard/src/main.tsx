import "@bunstack/react/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import i18n from "@/i18n";
import { routeTree } from "@/routeTree.gen";
import { Sayno } from "@bunstack/react/components/sayno";
import { Toaster } from "@bunstack/react/components/sonner";

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: { queryClient, session: null },
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
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="bottom-center" />
          <Sayno />
        </QueryClientProvider>
      </I18nextProvider>
    </StrictMode>,
  );
}

bootstrap();
